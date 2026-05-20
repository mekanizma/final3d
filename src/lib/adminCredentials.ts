/**
 * Admin giriş bilgileri yalnızca ortam değişkenlerinden okunur.
 * Production'da ADMIN_EMAIL ve ADMIN_PASSWORD zorunludur.
 */
export function getAdminCredentials(): {
  email: string;
  password: string;
} | null {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (process.env.NODE_ENV === "production") {
    if (!email || !password) return null;
    return { email, password };
  }

  if (email && password) return { email, password };

  return null;
}
