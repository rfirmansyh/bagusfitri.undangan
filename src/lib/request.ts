import { headers } from 'next/headers';

import type { TRequestMetadata } from '@/src/types/app.types';

function normalizeIpAddress(value: string | null | undefined): string | null {
  const normalized = value?.split(',')[0]?.trim();
  return normalized || null;
}

/**
 * Extract request metadata (IP address, user agent) from Next.js headers.
 * Uses Cloudflare-specific headers when available, with fallbacks.
 */
export async function getRequestMetadata(): Promise<TRequestMetadata> {
  const headersList = await headers();

  const ipAddress =
    normalizeIpAddress(headersList.get('cf-connecting-ip')) ??
    normalizeIpAddress(headersList.get('x-real-ip')) ??
    normalizeIpAddress(headersList.get('x-forwarded-for'));

  const userAgent = headersList.get('user-agent') ?? null;

  return { ipAddress, userAgent };
}
