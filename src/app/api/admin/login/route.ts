import { NextRequest, NextResponse } from 'next/server';

import { isAdminPasswordValid } from '@/src/lib/auth';
import type { TApiResponse } from '@/src/types/app.types';

/**
 * POST /api/admin/login — Verify admin password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body as { password?: string };

    if (!password || !(await isAdminPasswordValid(password))) {
      return NextResponse.json<TApiResponse>(
        { success: false, error: 'Password tidak valid.' },
        { status: 401 },
      );
    }

    return NextResponse.json<TApiResponse<{ authenticated: boolean }>>({
      success: true,
      data: { authenticated: true },
    });
  } catch (error) {
    return NextResponse.json<TApiResponse>(
      { success: false, error: 'Gagal memverifikasi password.' },
      { status: 500 },
    );
  }
}
