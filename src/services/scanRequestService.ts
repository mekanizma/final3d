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
  userId?: string;
  createdAt: string;
  status: "yeni" | "inceleniyor" | "teklif-gonderildi";
}

export type SubmitScanQuoteInput = Omit<
  ScanQuoteRequest,
  "id" | "createdAt" | "status"
>;

export async function submitScanQuoteRequest(
  input: SubmitScanQuoteInput
): Promise<ScanQuoteRequest> {
  const res = await fetch("/api/scan-quote", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || "Talep gönderilemedi.");
  }

  return res.json() as Promise<ScanQuoteRequest>;
}

export async function getScanQuoteRequests(): Promise<ScanQuoteRequest[]> {
  throw new Error("Admin paneli henüz talep listesini desteklemiyor.");
}
