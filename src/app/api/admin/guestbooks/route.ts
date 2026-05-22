import { NextRequest, NextResponse } from 'next/server';

import { assertAdminPassword } from '@/src/lib/auth';
import { getD1Database } from '@/src/lib/d1';
import { generateInviteLink, generateSignature, normalizeGuestName } from '@/src/lib/signature';
import { DEFAULT_CHAT_TEMPLATE } from '@/src/app/dashboard/_contant';
import type {
  TApiResponse,
  TCountRow,
  TGuestbook,
  TGuestbookRow,
  TPaginatedResult,
} from '@/src/types/app.types';

const PAGE_SIZE = 15;

/**
 * GET /api/admin/guestbooks — Get paginated guestbooks (admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password') ?? '';
    await assertAdminPassword(password);

    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const search = searchParams.get('search')?.trim() ?? '';
    const db = await getD1Database();

    // Get total count
    let countQuery = 'SELECT COUNT(*) AS count FROM guestbooks';
    const countBindings: string[] = [];
    if (search) {
      countQuery += ' WHERE name LIKE ?';
      countBindings.push(`%${search}%`);
    }

    const countStmt = db.prepare(countQuery);
    const countResult = countBindings.length
      ? await countStmt.bind(...countBindings).first<TCountRow>()
      : await countStmt.first<TCountRow>();
    const total = Number(countResult?.count ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const offset = (safePage - 1) * PAGE_SIZE;

    // Get paginated guestbooks
    let dataQuery = `SELECT id, name, signature, link, chat_template, created_at
         FROM guestbooks`;
    const dataBindings: (string | number)[] = [];
    if (search) {
      dataQuery += ' WHERE name LIKE ?';
      dataBindings.push(`%${search}%`);
    }
    dataQuery += ' ORDER BY created_at ASC LIMIT ? OFFSET ?';
    dataBindings.push(PAGE_SIZE, offset);

    const dataResult = await db
      .prepare(dataQuery)
      .bind(...dataBindings)
      .all<TGuestbookRow>();

    const guestbooks: TGuestbook[] = (dataResult.results ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      signature: row.signature,
      link: row.link,
      chatTemplate: row.chat_template,
      createdAt: row.created_at,
    }));

    const result: TPaginatedResult<TGuestbook> = {
      data: guestbooks,
      page: safePage,
      pageSize: PAGE_SIZE,
      total,
      totalPages,
    };

    return NextResponse.json<TApiResponse<TPaginatedResult<TGuestbook>>>({
      success: true,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Gagal memuat data guestbook.';
    const status = message.includes('Password') ? 401 : 500;

    return NextResponse.json<TApiResponse>(
      { success: false, error: message },
      { status },
    );
  }
}

/**
 * POST /api/admin/guestbooks — Create a new guestbook entry
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, name } = body as { password?: string; name?: string };

    await assertAdminPassword(password ?? '');

    const trimmedName = normalizeGuestName(name ?? '');
    if (!trimmedName || trimmedName.length > 120) {
      return NextResponse.json<TApiResponse>(
        { success: false, error: 'Nama tamu tidak valid.' },
        { status: 400 },
      );
    }

    const db = await getD1Database();

    // Check for duplicate name
    const existing = await db
      .prepare('SELECT id FROM guestbooks WHERE LOWER(name) = LOWER(?)')
      .bind(trimmedName)
      .first();
    if (existing) {
      return NextResponse.json<TApiResponse>(
        { success: false, error: `Tamu "${trimmedName}" sudah ada di daftar.` },
        { status: 409 },
      );
    }

    const id = crypto.randomUUID();
    const signature = await generateSignature(trimmedName);
    const link = generateInviteLink(trimmedName, signature);
    const chatTemplate = DEFAULT_CHAT_TEMPLATE(trimmedName, link);
    const createdAt = new Date().toISOString();

    await db
      .prepare(
        `INSERT INTO guestbooks (id, name, signature, link, chat_template, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(id, trimmedName, signature, link, chatTemplate, createdAt)
      .run();

    const entry: TGuestbook = {
      id,
      name: trimmedName,
      signature,
      link,
      chatTemplate,
      createdAt,
    };

    return NextResponse.json<TApiResponse<TGuestbook>>(
      { success: true, data: entry },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Gagal menambahkan tamu.';
    const status = message.includes('Password') ? 401 : 500;

    return NextResponse.json<TApiResponse>(
      { success: false, error: message },
      { status },
    );
  }
}

/**
 * DELETE /api/admin/guestbooks — Delete guestbooks (single, bulk, or all)
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, id, ids, deleteAll } = body as { 
      password?: string; 
      id?: string;
      ids?: string[];
      deleteAll?: boolean;
    };

    await assertAdminPassword(password ?? '');

    const db = await getD1Database();

    if (deleteAll) {
      await db.prepare('DELETE FROM guestbooks').run();
      return NextResponse.json<TApiResponse<{ deleted: string }>>({
        success: true,
        data: { deleted: 'all' },
      });
    }

    if (Array.isArray(ids) && ids.length > 0) {
      const placeholders = ids.map(() => '?').join(', ');
      await db
        .prepare(`DELETE FROM guestbooks WHERE id IN (${placeholders})`)
        .bind(...ids)
        .run();
      return NextResponse.json<TApiResponse<{ deleted: number }>>({
        success: true,
        data: { deleted: ids.length },
      });
    }

    if (!id) {
      return NextResponse.json<TApiResponse>(
        { success: false, error: 'ID guestbook wajib diisi.' },
        { status: 400 },
      );
    }

    await db.prepare('DELETE FROM guestbooks WHERE id = ?').bind(id).run();

    return NextResponse.json<TApiResponse<{ id: string }>>({
      success: true,
      data: { id },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Gagal menghapus tamu.';
    const status = message.includes('Password') ? 401 : 500;

    return NextResponse.json<TApiResponse>(
      { success: false, error: message },
      { status },
    );
  }
}
