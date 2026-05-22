const INVITE_DOMAIN = 'https://bagusfitri-undangan.online';
const SIGNATURE_SALT = 'kondangan-guestbook-2026';

/**
 * Normalize a guest name for use in URLs.
 * Trims whitespace and encodes for URL usage.
 */
export function normalizeGuestName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

/**
 * Generate a unique signature for a guest using Web Crypto API.
 * Uses SHA-256 hash of (name + salt) truncated to 8 hex chars.
 */
export async function generateSignature(name: string): Promise<string> {
  const normalized = normalizeGuestName(name).toLowerCase();
  const data = new TextEncoder().encode(`${normalized}::${SIGNATURE_SALT}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex.slice(0, 12);
}

/**
 * Generate the invitation link for a guest.
 */
export function generateInviteLink(name: string, signature: string): string {
  const normalized = normalizeGuestName(name);
  return `${INVITE_DOMAIN}?kepada=${encodeURIComponent(normalized)}&s=${signature}`;
}

/**
 * Verify a signature matches a guest name.
 */
export async function verifySignature(
  name: string,
  signature: string,
): Promise<boolean> {
  const expected = await generateSignature(name);
  return expected === signature;
}
