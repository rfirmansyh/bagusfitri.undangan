import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Get the Cloudflare D1 database binding.
 * Works in both local dev (via wrangler) and production.
 */
export async function getD1Database(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  const db = (env as Record<string, unknown>)['DB'] as D1Database | undefined;

  if (!db) {
    throw new Error(
      'D1 database binding "DB" not found. Make sure wrangler.jsonc has the d1_databases config.',
    );
  }

  return db;
}
