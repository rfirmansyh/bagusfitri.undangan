/**
 * Get the admin password from Cloudflare context or process.env.
 */
export async function getAdminPassword(): Promise<string> {
  if ((process.env as any)?.ADMIN_PASSWORD) {
    return (process.env as any)?.ADMIN_PASSWORD;
  }
  throw new Error('Password admin tidak valid');
}

/**
 * Verify admin password. Throws if invalid.
 */
export async function assertAdminPassword(password: string): Promise<void> {
  const adminPassword = await getAdminPassword();
  if (password.trim() !== adminPassword) {
    throw new Error('Password admin tidak valid.');
  }
}

/**
 * Check if admin password is valid. Returns boolean.
 */
export async function isAdminPasswordValid(password: string): Promise<boolean> {
  const adminPassword = await getAdminPassword();

  console.log('adminPassword', adminPassword)
  console.log('password', password)
  return password.trim() === adminPassword;
}
