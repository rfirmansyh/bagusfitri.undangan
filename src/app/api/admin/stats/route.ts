import { NextRequest, NextResponse } from 'next/server';

import { assertAdminPassword } from '@/src/lib/auth';
import { getD1Database } from '@/src/lib/d1';
import type { TApiResponse, TCountRow, TDashboardStats } from '@/src/types/app.types';

/**
 * GET /api/admin/stats — Get dashboard statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password') ?? '';
    await assertAdminPassword(password);

    const db = await getD1Database();

    const [rsvpCount, guestSum, wishCount, visibleWishCount] =
      await Promise.all([
        db
          .prepare('SELECT COUNT(*) AS count FROM rsvps')
          .first<TCountRow>(),
        db
          .prepare(
            'SELECT COALESCE(SUM(guests), 0) AS count FROM rsvps WHERE guests > 0',
          )
          .first<TCountRow>(),
        db
          .prepare('SELECT COUNT(*) AS count FROM wishes')
          .first<TCountRow>(),
        db
          .prepare(
            'SELECT COUNT(*) AS count FROM wishes WHERE hidden_at IS NULL',
          )
          .first<TCountRow>(),
      ]);

    const stats: TDashboardStats = {
      totalRsvps: Number(rsvpCount?.count ?? 0),
      totalGuests: Number(guestSum?.count ?? 0),
      totalWishes: Number(wishCount?.count ?? 0),
      totalVisibleWishes: Number(visibleWishCount?.count ?? 0),
    };

    return NextResponse.json<TApiResponse<TDashboardStats>>({
      success: true,
      data: stats,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Gagal memuat statistik.';
    const status = message.includes('Password') ? 401 : 500;

    return NextResponse.json<TApiResponse>(
      { success: false, error: message },
      { status },
    );
  }
}
