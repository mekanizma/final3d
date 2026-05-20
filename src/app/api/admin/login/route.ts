import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/adminSession";
import { getAdminCredentials } from "@/lib/adminCredentials";

export async function POST(request: Request) {
  const credentials = getAdminCredentials();
  if (!credentials) {
    return NextResponse.json(
      {
        ok: false,
        error:
          process.env.NODE_ENV === "production"
            ? "Sunucu yapılandırması eksik (ADMIN_EMAIL / ADMIN_PASSWORD)."
            : "Admin girişi için .env.local dosyasına ADMIN_EMAIL ve ADMIN_PASSWORD ekleyin.",
      },
      { status: 503 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Geçersiz istek" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (
    email === credentials.email.toLowerCase() &&
    password === credentials.password
  ) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_SESSION_COOKIE, "1", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }

  return NextResponse.json(
    { ok: false, error: "E-posta veya şifre hatalı." },
    { status: 401 }
  );
}
