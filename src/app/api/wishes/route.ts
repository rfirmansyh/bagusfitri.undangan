import { NextRequest, NextResponse } from 'next/server';

import { getD1Database } from '@/src/lib/d1';
import { checkWishRateLimit } from '@/src/lib/rate-limit';
import { getRequestMetadata } from '@/src/lib/request';
import type {
  TApiResponse,
  TCountRow,
  TPublicWish,
  TWish,
  TWishRow,
} from '@/src/types/app.types';

const PUBLIC_WISHES_LIMIT = 10;

/**
 * POST /api/wishes — Submit a new wish
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, message } = body as { name?: string; message?: string };

    // Validate input
    const trimmedName = name?.trim() ?? '';
    if (!trimmedName || trimmedName.length > 120) {
      return NextResponse.json<TApiResponse>(
        { success: false, error: 'Nama tidak valid.' },
        { status: 400 },
      );
    }

    const trimmedMessage = message?.trim() ?? '';
    if (!trimmedMessage || trimmedMessage.length > 1000) {
      return NextResponse.json<TApiResponse>(
        { success: false, error: 'Ucapan tidak valid (maks 1000 karakter).' },
        { status: 400 },
      );
    }

    // Rate limiting
    const metadata = await getRequestMetadata();
    await checkWishRateLimit(metadata.ipAddress);

    // Insert into D1
    const db = await getD1Database();
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await db
      .prepare(
        `INSERT INTO wishes (id, name, message, ip_address, user_agent, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        trimmedName,
        trimmedMessage,
        metadata.ipAddress,
        metadata.userAgent,
        createdAt,
      )
      .run();

    const entry: TPublicWish = {
      id,
      name: trimmedName,
      message: trimmedMessage,
      createdAt,
    };

    return NextResponse.json<TApiResponse<TPublicWish>>(
      { success: true, data: entry },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Gagal mengirim ucapan.';
    const status = message.includes('Terlalu banyak') ? 429 : 500;

    return NextResponse.json<TApiResponse>(
      { success: false, error: message },
      { status },
    );
  }
}

/**
 * GET /api/wishes — Get visible wishes (public, paginated)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = Math.max(0, Number(searchParams.get('offset') ?? 0));

    const db = await getD1Database();

    const wishes = await db
      .prepare(
        `SELECT id, name, message, created_at
         FROM wishes
         WHERE hidden_at IS NULL
         ORDER BY created_at DESC
         LIMIT ?
         OFFSET ?`,
      )
      .bind(PUBLIC_WISHES_LIMIT + 1, offset)
      .all<{ id: string; name: string; message: string; created_at: string }>();

    const results: TPublicWish[] = (wishes.results ?? [])
      .slice(0, PUBLIC_WISHES_LIMIT)
      .map((row) => ({
        id: row.id,
        name: row.name,
        message: row.message,
        createdAt: row.created_at,
      }));

    const hasMore = (wishes.results ?? []).length > PUBLIC_WISHES_LIMIT;

    return NextResponse.json<
      TApiResponse<{ wishes: TPublicWish[]; hasMore: boolean }>
    >({
      success: true,
      data: { wishes: results, hasMore },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Gagal memuat ucapan.';

    return NextResponse.json<TApiResponse>(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
