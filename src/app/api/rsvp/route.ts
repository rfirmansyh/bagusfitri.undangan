import { NextRequest, NextResponse } from 'next/server';

import { getD1Database } from '@/src/lib/d1';
import { checkRsvpRateLimit } from '@/src/lib/rate-limit';
import { getRequestMetadata } from '@/src/lib/request';
import type { TApiResponse, TRsvp, TRsvpRow } from '@/src/types/app.types';

/**
 * POST /api/rsvp — Submit a new RSVP
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, guests } = body as { name?: string; guests?: number };

    // Validate input
    const trimmedName = name?.trim() ?? '';
    if (!trimmedName || trimmedName.length > 120) {
      return NextResponse.json<TApiResponse>(
        { success: false, error: 'Nama tidak valid.' },
        { status: 400 },
      );
    }

    const guestsCount = Number(guests);
    if (
      !Number.isInteger(guestsCount) ||
      guestsCount < 0 ||
      guestsCount > 10
    ) {
      return NextResponse.json<TApiResponse>(
        { success: false, error: 'Jumlah tamu tidak valid (0-10).' },
        { status: 400 },
      );
    }

    // Rate limiting
    const metadata = await getRequestMetadata();
    await checkRsvpRateLimit(metadata.ipAddress);

    // Insert into D1
    const db = await getD1Database();
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await db
      .prepare(
        `INSERT INTO rsvps (id, name, guests, ip_address, user_agent, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        trimmedName,
        guestsCount,
        metadata.ipAddress,
        metadata.userAgent,
        createdAt,
      )
      .run();

    const entry: TRsvp = {
      id,
      name: trimmedName,
      guests: guestsCount,
      ipAddress: metadata.ipAddress,
      createdAt,
    };

    return NextResponse.json<TApiResponse<TRsvp>>(
      { success: true, data: entry },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Gagal mengirim RSVP.';
    const status = message.includes('Terlalu banyak') ? 429 : 500;

    return NextResponse.json<TApiResponse>(
      { success: false, error: message },
      { status },
    );
  }
}

/**
 * GET /api/rsvp — Get all RSVPs (public)
 */
export async function GET() {
  try {
    const db = await getD1Database();

    const result = await db
      .prepare(
        `SELECT id, name, guests, created_at AS created_at
         FROM rsvps
         ORDER BY created_at DESC`,
      )
      .all<TRsvpRow>();

    const rsvps: TRsvp[] = (result.results ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      guests: Number(row.guests),
      ipAddress: null, // Don't expose IP to public
      createdAt: row.created_at,
    }));

    return NextResponse.json<TApiResponse<TRsvp[]>>({
      success: true,
      data: rsvps,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Gagal memuat RSVP.';

    return NextResponse.json<TApiResponse>(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
