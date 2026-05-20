import type {
  ScanLocationId,
  ScanPurposeId,
  ScanSurfaceId,
} from "@/lib/scanQuoteOptions";

export interface ScanQuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  objectDescription: string;
  scanArea: string;
  quantity: string;
  locationType: ScanLocationId;
  locationAddress: string;
  city: string;
  purpose: ScanPurposeId;
  surfaceType: ScanSurfaceId;
  wantsPrint: boolean;
  note: string;
  photoFileName?: string;
  photoFileSize?: number;
  photoStoragePath?: string;
  userId?: string;
  createdAt: string;
  status: "yeni" | "inceleniyor" | "teklif-gonderildi";
}

export type QuoteNotificationResult = {
  sent: boolean;
  mock?: boolean;
  error?: string;
};

export type ScanQuoteSubmitResult = ScanQuoteRequest & {
  notification?: QuoteNotificationResult;
  storageWarning?: string;
};

export async function submitScanQuoteRequest(
  formData: FormData
): Promise<ScanQuoteSubmitResult> {
  const res = await fetch("/api/scan-quote", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || "Talep gönderilemedi.");
  }

  return res.json() as Promise<ScanQuoteSubmitResult>;
}

export async function getScanQuoteRequests(): Promise<ScanQuoteRequest[]> {
  const res = await fetch("/api/admin/scan-quotes", { credentials: "include" });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || "Talepler yüklenemedi.");
  }
  return res.json() as Promise<ScanQuoteRequest[]>;
}

export async function updateScanQuoteStatus(
  id: string,
  status: ScanQuoteRequest["status"]
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
