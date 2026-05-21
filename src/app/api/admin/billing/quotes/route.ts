import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/api/requireAdmin";
import {
  getAdminQuoteDocument,
  listAdminQuoteDocuments,
} from "@/lib/billing/adminQuoteDb";
import type { QuotePdfType } from "@/lib/billing/quoteTypes";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    await assertAdminSession();
    const type = new URL(req.url).searchParams.get("type") as QuotePdfType | null;
    const items = await listAdminQuoteDocuments(
      type === "scan" || type === "custom" ? type : undefined
    );
    return NextResponse.json(items);
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Admin") ? 401 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await assertAdminSession();
    const { id } = (await req.json()) as { id: string };
    if (!id?.trim()) {
      return NextResponse.json({ error: "id gerekli." }, { status: 400 });
    }
    const document = await getAdminQuoteDocument(id);
    if (!document) {
      return NextResponse.json({ error: "Teklif bulunamadı." }, { status: 404 });
    }
    return NextResponse.json({ document });
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Admin") ? 401 : 500 }
    );
  }
}
