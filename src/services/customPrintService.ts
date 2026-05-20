export interface CustomPrintRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  material: "pla" | "abs" | "petg" | "tpu";
  color: string;
  quantity: string;
  note: string;
  fileName: string;
  fileSize: number;
  userId?: string;
  createdAt: string;
  status: "yeni" | "inceleniyor" | "teklif-gonderildi";
}

export type SubmitCustomPrintInput = Omit<
  CustomPrintRequest,
  "id" | "createdAt" | "status"
>;

export async function submitCustomPrintRequest(
  input: SubmitCustomPrintInput
): Promise<CustomPrintRequest> {
  const res = await fetch("/api/custom-print", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || "Talep gönderilemedi.");
  }

  return res.json() as Promise<CustomPrintRequest>;
}

export async function updateCustomPrintStatus(
  id: string,
  status: CustomPrintRequest["status"]
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

export async function getCustomPrintRequests(): Promise<CustomPrintRequest[]> {
  const res = await fetch("/api/admin/custom-print", { credentials: "include" });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || "Talepler yüklenemedi.");
  }
  return res.json() as Promise<CustomPrintRequest[]>;
}
