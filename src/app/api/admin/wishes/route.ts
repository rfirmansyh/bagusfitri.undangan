import { NextRequest, NextResponse } from 'next/server';

import { assertAdminPassword } from '@/src/lib/auth';
import { getD1Database } from '@/src/lib/d1';
import type {
  TAdminWish,
  TApiResponse,
  TCountRow,
  TPaginatedResult,
  TWishRow,
} from '@/src/types/app.types';

const PAGE_SIZE = 15;

/**
 * GET /api/admin/wishes — Get paginated wishes (admin, includes hidden)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password') ?? '';
    await assertAdminPassword(password);

    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const db = await getD1Database();

    // Get total count (all wishes, including hidden)
    const countResult = await db
      .prepare('SELECT COUNT(*) AS count FROM wishes')
      .first<TCountRow>();
    const total = Number(countResult?.count ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const offset = (safePage - 1) * PAGE_SIZE;

    // Get paginated wishes
    const wishesResult = await db
      .prepare(
        `SELECT id, name, message, ip_address, user_agent, hidden_at, created_at
         FROM wishes
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
      )
      .bind(PAGE_SIZE, offset)
      .all<TWishRow>();

    const wishes: TAdminWish[] = (wishesResult.results ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      message: row.message,
      ipAddress: row.ip_address,
      hiddenAt: row.hidden_at,
      createdAt: row.created_at,
    }));

    const result: TPaginatedResult<TAdminWish> = {
      data: wishes,
      page: safePage,
      pageSize: PAGE_SIZE,
      total,
      totalPages,
    };

    return NextResponse.json<TApiResponse<TPaginatedResult<TAdminWish>>>({
      success: true,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Gagal memuat ucapan.';
    const status = message.includes('Password') ? 401 : 500;

    return NextResponse.json<TApiResponse>(
      { success: false, error: message },
      { status },
    );
  }
}

/**
 * DELETE /api/admin/wishes — Delete a wish by ID
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, id } = body as { password?: string; id?: string };

    await assertAdminPassword(password ?? '');

    if (!id) {
      return NextResponse.json<TApiResponse>(
        { success: false, error: 'ID ucapan wajib diisi.' },
        { status: 400 },
      );
    }

    const db = await getD1Database();
    await db.prepare('DELETE FROM wishes WHERE id = ?').bind(id).run();

    return NextResponse.json<TApiResponse<{ id: string }>>({
      success: true,
      data: { id },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Gagal menghapus ucapan.';
    const status = message.includes('Password') ? 401 : 500;

    return NextResponse.json<TApiResponse>(
      { success: false, error: message },
      { status },
    );
  }
}

/**
 * PATCH /api/admin/wishes — Toggle wish visibility
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, id, hidden } = body as {
      password?: string;
      id?: string;
      hidden?: boolean;
    };

    await assertAdminPassword(password ?? '');

    if (!id) {
      return NextResponse.json<TApiResponse>(
        { success: false, error: 'ID ucapan wajib diisi.' },
        { status: 400 },
      );
    }

    const db = await getD1Database();
    const hiddenAt = hidden ? new Date().toISOString() : null;

    await db
      .prepare('UPDATE wishes SET hidden_at = ? WHERE id = ?')
      .bind(hiddenAt, id)
      .run();

    return NextResponse.json<TApiResponse<{ id: string; hidden: boolean }>>({
      success: true,
      data: { id, hidden: !!hidden },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Gagal mengubah visibilitas ucapan.';
    const status = message.includes('Password') ? 401 : 500;

    return NextResponse.json<TApiResponse>(
      { success: false, error: message },
      { status },
    );
  }
}
