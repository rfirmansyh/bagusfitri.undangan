import { NextRequest, NextResponse } from 'next/server';

import { assertAdminPassword } from '@/src/lib/auth';
import { getD1Database } from '@/src/lib/d1';
import { generateInviteLink, generateSignature, normalizeGuestName } from '@/src/lib/signature';
import { DEFAULT_CHAT_TEMPLATE } from '@/src/app/dashboard/_contant';
import type { TApiResponse, TBulkImportResult } from '@/src/types/app.types';

/**
 * POST /api/admin/guestbooks/bulk — Bulk import guestbooks from JSON array
 * Expected body: { password: string, names: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, names } = body as { password?: string; names?: string[] };

    await assertAdminPassword(password ?? '');

    if (!Array.isArray(names) || names.length === 0) {
      return NextResponse.json<TApiResponse>(
        { success: false, error: 'Data nama tamu kosong.' },
        { status: 400 },
      );
    }

    if (names.length > 500) {
      return NextResponse.json<TApiResponse>(
        { success: false, error: 'Maksimal 500 tamu per import.' },
        { status: 400 },
      );
    }

    const db = await getD1Database();

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Process each name
    for (const rawName of names) {
      const name = normalizeGuestName(rawName ?? '');

      if (!name || name.length > 120) {
        errors.push(`Nama "${rawName}" tidak valid (kosong atau terlalu panjang).`);
        continue;
      }

      // Check for duplicate
      const existing = await db
        .prepare('SELECT id FROM guestbooks WHERE LOWER(name) = LOWER(?)')
        .bind(name)
        .first();

      if (existing) {
        skipped++;
        continue;
      }

      try {
        const id = crypto.randomUUID();
        const signature = await generateSignature(name);
        const link = generateInviteLink(name, signature);
        const chatTemplate = DEFAULT_CHAT_TEMPLATE(name, link);
        const createdAt = new Date().toISOString();

        await db
          .prepare(
            `INSERT INTO guestbooks (id, name, signature, link, chat_template, created_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
          )
          .bind(id, name, signature, link, chatTemplate, createdAt)
          .run();

        imported++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Gagal menambahkan "${name}": ${msg}`);
      }
    }

    const result: TBulkImportResult = { imported, skipped, errors };

    return NextResponse.json<TApiResponse<TBulkImportResult>>({
      success: true,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Gagal melakukan import.';
    const status = message.includes('Password') ? 401 : 500;

    return NextResponse.json<TApiResponse>(
      { success: false, error: message },
      { status },
    );
  }
}
