const ADMIN_PASSWORD = '123123';

/**
 * Verify admin password. Throws if invalid.
 */
export function assertAdminPassword(password: string): void {
  if (password.trim() !== ADMIN_PASSWORD) {
    throw new Error('Password admin tidak valid.');
  }
}

/**
 * Check if admin password is valid. Returns boolean.
 */
export function isAdminPasswordValid(password: string): boolean {
  return password.trim() === ADMIN_PASSWORD;
}
