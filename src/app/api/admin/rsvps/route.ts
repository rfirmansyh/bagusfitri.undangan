import { NextRequest, NextResponse } from 'next/server';

import { assertAdminPassword } from '@/src/lib/auth';
import { getD1Database } from '@/src/lib/d1';
import type {
  TAdminRsvp,
  TApiResponse,
  TCountRow,
  TPaginatedResult,
  TRsvpRow,
} from '@/src/types/app.types';

const PAGE_SIZE = 15;

/**
 * GET /api/admin/rsvps — Get paginated RSVPs (admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password') ?? '';
    assertAdminPassword(password);

    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const db = await getD1Database();

    // Get total count
    const countResult = await db
      .prepare('SELECT COUNT(*) AS count FROM rsvps')
      .first<TCountRow>();
    const total = Number(countResult?.count ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const offset = (safePage - 1) * PAGE_SIZE;

    // Get paginated RSVPs
    const rsvpsResult = await db
      .prepare(
        `SELECT id, name, guests, ip_address, user_agent, created_at
         FROM rsvps
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
      )
      .bind(PAGE_SIZE, offset)
      .all<TRsvpRow>();

    const rsvps: TAdminRsvp[] = (rsvpsResult.results ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      guests: Number(row.guests),
      ipAddress: row.ip_address,
      createdAt: row.created_at,
    }));

    const result: TPaginatedResult<TAdminRsvp> = {
      data: rsvps,
      page: safePage,
      pageSize: PAGE_SIZE,
      total,
      totalPages,
    };

    return NextResponse.json<TApiResponse<TPaginatedResult<TAdminRsvp>>>({
      success: true,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Gagal memuat data RSVP.';
    const status = message.includes('Password') ? 401 : 500;

    return NextResponse.json<TApiResponse>(
      { success: false, error: message },
      { status },
    );
  }
}

/**
 * DELETE /api/admin/rsvps — Delete an RSVP by ID
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, id } = body as { password?: string; id?: string };

    assertAdminPassword(password ?? '');

    if (!id) {
      return NextResponse.json<TApiResponse>(
        { success: false, error: 'ID RSVP wajib diisi.' },
        { status: 400 },
      );
    }

    const db = await getD1Database();
    await db.prepare('DELETE FROM rsvps WHERE id = ?').bind(id).run();

    return NextResponse.json<TApiResponse<{ id: string }>>({
      success: true,
      data: { id },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Gagal menghapus RSVP.';
    const status = message.includes('Password') ? 401 : 500;

    return NextResponse.json<TApiResponse>(
      { success: false, error: message },
      { status },
    );
  }
}
