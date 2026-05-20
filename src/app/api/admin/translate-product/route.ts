import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/adminSession";
import { generateProductTranslations } from "@/lib/generateProductTranslations";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get(ADMIN_SESSION_COOKIE)?.value !== "1") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  let body: { name?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const description = (body.description ?? "").trim();

  if (!name) {
    return NextResponse.json({ error: "Ürün adı gerekli" }, { status: 400 });
  }

  const translations = await generateProductTranslations(name, description);
  return NextResponse.json({ translations });
}
