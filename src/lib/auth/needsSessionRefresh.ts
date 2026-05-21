/** Supabase oturum yenileme — yalnızca oturum gerektiren rotalarda */
export function needsSessionRefresh(innerPath: string): boolean {
  return (
    innerPath.startsWith("/admin") ||
    innerPath.startsWith("/hesabim") ||
    innerPath.startsWith("/giris") ||
    innerPath.startsWith("/kayit-ol") ||
    innerPath.startsWith("/order")
  );
}
