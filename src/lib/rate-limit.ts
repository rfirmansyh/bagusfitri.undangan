import { getD1Database } from './d1';

import type { TCountRow } from '@/src/types/app.types';

const RATE_LIMIT_WINDOW_MINUTES = 5;
const RATE_LIMIT_MAX_RSVPS = 3;
const RATE_LIMIT_MAX_WISHES = 5;

/**
 * Check whether an IP has exceeded the rate limit for a given table.
 * Returns true if the IP is rate-limited (should be blocked).
 */
async function isRateLimited(
  db: D1Database,
  table: 'rsvps' | 'wishes',
  ipAddress: string,
  maxRequests: number,
): Promise<boolean> {
  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  ).toISOString();

  const result = await db
    .prepare(
      `SELECT COUNT(*) AS count FROM ${table} WHERE ip_address = ? AND created_at >= ?`,
    )
    .bind(ipAddress, windowStart)
    .first<TCountRow>();

  const count = Number(result?.count ?? 0);
  return count >= maxRequests;
}

/**
 * Check RSVP rate limit for an IP address.
 * Throws if exceeded.
 */
export async function checkRsvpRateLimit(
  ipAddress: string | null,
): Promise<void> {
  if (!ipAddress) return;

  const db = await getD1Database();
  const limited = await isRateLimited(
    db,
    'rsvps',
    ipAddress,
    RATE_LIMIT_MAX_RSVPS,
  );

  if (limited) {
    throw new Error(
      'Terlalu banyak pengiriman RSVP. Silakan coba lagi nanti.',
    );
  }
}

/**
 * Check wish rate limit for an IP address.
 * Throws if exceeded.
 */
export async function checkWishRateLimit(
  ipAddress: string | null,
): Promise<void> {
  if (!ipAddress) return;

  const db = await getD1Database();
  const limited = await isRateLimited(
    db,
    'wishes',
    ipAddress,
    RATE_LIMIT_MAX_WISHES,
  );

  if (limited) {
    throw new Error(
      'Terlalu banyak pengiriman ucapan. Silakan coba lagi nanti.',
    );
  }
}
