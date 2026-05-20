import { generateId } from "@/lib/utils";

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

export async function getCustomPrintRequests(): Promise<CustomPrintRequest[]> {
  throw new Error("Admin paneli henüz talep listesini desteklemiyor.");
}
