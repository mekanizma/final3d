import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/api/requireAdmin";
import { saveAdminQuoteDocument } from "@/lib/billing/adminQuoteDb";
import {
  generateCustomPrintQuotePdfBuffer,
  generateScanQuotePdfBuffer,
} from "@/lib/billing/pdfQuote";

export const runtime = "nodejs";
import type {
  CustomPrintQuoteDocument,
  QuotePdfType,
  ScanQuoteDocument,
} from "@/lib/billing/quoteTypes";
function validateClient(client: ScanQuoteDocument["client"]): string | null {
  if (!client.name?.trim()) return "Müşteri adı gerekli.";
  if (!client.phone?.trim() && !client.email?.trim()) {
    return "Telefon veya e-posta girin.";
  }
  return null;
}

function validateLineItems(items: ScanQuoteDocument["lineItems"]): string | null {
  if (!items.length) return "En az bir fiyat kalemi ekleyin.";
  for (const item of items) {
    if (!item.description?.trim()) return "Tüm kalemlerde açıklama girin.";
    if (item.quantity <= 0) return "Adet 0'dan büyük olmalı.";
    if (item.unitPrice < 0) return "Birim fiyat geçersiz.";
  }
  return null;
}

export async function POST(req: Request) {
  try {
    await assertAdminSession();
    const body = (await req.json()) as {
      type: QuotePdfType;
      document: ScanQuoteDocument | CustomPrintQuoteDocument;
    };

    if (body.type !== "scan" && body.type !== "custom") {
      return NextResponse.json({ error: "Geçersiz teklif türü." }, { status: 400 });
    }

    const doc = body.document;
    const clientErr = validateClient(doc.client);
    if (clientErr) {
      return NextResponse.json({ error: clientErr }, { status: 400 });
    }
    const itemsErr = validateLineItems(doc.lineItems);
    if (itemsErr) {
      return NextResponse.json({ error: itemsErr }, { status: 400 });
    }

    if (body.type === "scan") {
      const scan = doc as ScanQuoteDocument;
      if (!scan.objectDescription?.trim()) {
        return NextResponse.json(
          { error: "Nesne / parça açıklaması gerekli." },
          { status: 400 }
        );
      }
      if (!scan.scanArea?.trim()) {
        return NextResponse.json(
          { error: "Taranacak alan bilgisi gerekli." },
          { status: 400 }
        );
      }
      await saveAdminQuoteDocument("scan", scan);
      const buffer = await generateScanQuotePdfBuffer(scan);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${scan.quoteNo}.pdf"`,
          "Cache-Control": "no-store",
        },
      });
    }

    const custom = doc as CustomPrintQuoteDocument;
    await saveAdminQuoteDocument("custom", custom);
    const buffer = await generateCustomPrintQuotePdfBuffer(custom);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${custom.quoteNo}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Admin") ? 401 : 500 }
    );
  }
}
