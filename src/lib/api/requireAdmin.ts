import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/adminSession";

export async function requireAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value === "1";
}

export async function assertAdminSession() {
  if (!(await requireAdminSession())) {
    throw new Error("Admin oturumu gerekli.");
  }
}
