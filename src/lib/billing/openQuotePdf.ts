import type {
  CustomPrintQuoteDocument,
  QuotePdfType,
  ScanQuoteDocument,
} from "@/lib/billing/quoteTypes";
import {
  filenameFromDisposition,
  openOrDownloadBlob,
} from "@/lib/downloadBlob";

const PDF_FETCH_TIMEOUT_MS = 90_000;

export async function openQuotePdf(
  type: QuotePdfType,
  document: ScanQuoteDocument | CustomPrintQuoteDocument
): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PDF_FETCH_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch("/api/admin/billing/quote-pdf", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, document }),
      signal: controller.signal,
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") {
      throw new Error("PDF oluşturma zaman aşımına uğradı. Tekrar deneyin.");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || res.statusText);
  }

  const blob = await res.blob();
  if (!blob.size) {
    throw new Error("Boş PDF yanıtı alındı.");
  }

  const contentType = res.headers.get("Content-Type") ?? "";
  if (!contentType.includes("pdf") && blob.type && !blob.type.includes("pdf")) {
    const text = await blob.text();
    try {
      const j = JSON.parse(text) as { error?: string };
      throw new Error(j.error || "PDF oluşturulamadı.");
    } catch (e) {
      if (e instanceof Error && e.message !== "PDF oluşturulamadı.") throw e;
      throw new Error("Geçersiz PDF yanıtı.");
    }
  }

  const filename =
    filenameFromDisposition(
      res.headers.get("Content-Disposition"),
      `${document.quoteNo}.pdf`
    ) || `${document.quoteNo}.pdf`;

  const mode = await openOrDownloadBlob(blob, filename);
  if (mode === "downloaded") {
    return;
  }
}
