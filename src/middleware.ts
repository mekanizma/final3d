import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/adminSession";
import { updateSession } from "@/lib/supabase/middleware";
import { defaultLocale, isLocale } from "@/i18n/config";

function isAdminAuthed(request: NextRequest) {
  return request.cookies.get(ADMIN_SESSION_COOKIE)?.value === "1";
}

function stripLocalePath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (!parts[0] || !isLocale(parts[0])) return pathname;
  const rest = parts.slice(1).join("/");
  return rest ? `/${rest}` : "/";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/custom-print") ||
    pathname.startsWith("/api/scan-quote")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    return updateSession(request);
  }

  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  const first = pathname.split("/").filter(Boolean)[0];
  if (!first || !isLocale(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const inner = stripLocalePath(pathname);

  if (inner === "/admin/giris" || inner.startsWith("/admin/giris/")) {
    if (isAdminAuthed(request)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${first}/admin`;
      return NextResponse.redirect(url);
    }
    return updateSession(request);
  }

  if (inner.startsWith("/admin")) {
    if (!isAdminAuthed(request)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${first}/admin/giris`;
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
