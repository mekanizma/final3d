import type {
  CustomPrintQuoteDocument,
  QuotePdfType,
  ScanQuoteDocument,
} from "@/lib/billing/quoteTypes";

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

  const url = URL.createObjectURL(blob);
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) {
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${document.quoteNo}.pdf`;
    a.rel = "noopener";
    a.click();
  }
  setTimeout(() => URL.revokeObjectURL(url), 120_000);
}
