import type { CustomPrintRequest } from "@/services/customPrintService";
import type { ScanQuoteRequest } from "@/services/scanRequestService";
import type { RequestStatus } from "@/lib/constants";

export type QuoteKind = "custom" | "scan";

export type AdminQuotesPayload = {
  custom: CustomPrintRequest[];
  scan: ScanQuoteRequest[];
};

export type QuoteAttachmentMeta = {
  url: string;
  fileName: string;
  isImage: boolean;
};

export async function getAdminQuotes(): Promise<AdminQuotesPayload> {
  const res = await fetch("/api/admin/quotes", { credentials: "include" });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || "Teklifler yüklenemedi.");
  }
  return res.json() as Promise<AdminQuotesPayload>;
}

export async function fetchQuoteAttachment(
  kind: QuoteKind,
  id: string
): Promise<QuoteAttachmentMeta> {
  const q = new URLSearchParams({ kind, id });
  const res = await fetch(`/api/admin/quotes/attachment?${q}`, {
    credentials: "include",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || "Dosya açılamadı.");
  }
  return res.json() as Promise<QuoteAttachmentMeta>;
}

export async function updateCustomPrintStatus(
  id: string,
  status: RequestStatus
): Promise<CustomPrintRequest> {
  const res = await fetch(`/api/admin/custom-print/${encodeURIComponent(id)}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || "Durum güncellenemedi.");
  }
  return res.json() as Promise<CustomPrintRequest>;
}

export async function updateScanQuoteStatus(
  id: string,
  status: RequestStatus
): Promise<ScanQuoteRequest> {
  const res = await fetch(`/api/admin/scan-quotes/${encodeURIComponent(id)}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || "Durum güncellenemedi.");
  }
  return res.json() as Promise<ScanQuoteRequest>;
}
