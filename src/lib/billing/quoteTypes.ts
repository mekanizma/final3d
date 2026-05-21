import type { ScanLocationId, ScanPurposeId, ScanSurfaceId } from "@/lib/scanQuoteOptions";

export interface QuoteLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface QuoteClientInfo {
  name: string;
  email: string;
  phone: string;
  company?: string;
}

export interface ScanQuoteDocument {
  quoteNo: string;
  issuedAt: string;
  validUntil: string;
  client: QuoteClientInfo;
  objectDescription: string;
  scanArea: string;
  quantity: string;
  locationType: ScanLocationId;
  locationAddress: string;
  city: string;
  purpose: ScanPurposeId;
  surfaceType: ScanSurfaceId;
  wantsPrint: boolean;
  clientNote: string;
  lineItems: QuoteLineItem[];
  adminNote: string;
  terms: string;
}

export interface CustomPrintQuoteDocument {
  quoteNo: string;
  issuedAt: string;
  validUntil: string;
  client: QuoteClientInfo;
  material: "pla" | "abs" | "petg" | "tpu";
  color: string;
  quantity: string;
  fileName: string;
  clientNote: string;
  lineItems: QuoteLineItem[];
  adminNote: string;
  terms: string;
}

export type QuotePdfType = "scan" | "custom";

export function generateQuoteNo(kind: QuotePdfType): string {
  const prefix = kind === "scan" ? "TEK-TAR" : "TEK-BSK";
  const d = new Date();
  const date = d.toISOString().slice(0, 10).replace(/-/g, "");
  const seq = String(d.getTime()).slice(-5);
  return `${prefix}-${date}-${seq}`;
}

export function addValidDays(issuedYmd: string, days: number): string {
  const [y, m, d] = issuedYmd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + Math.max(1, days));
  return dt.toISOString().slice(0, 10);
}

export function lineItemTotal(item: QuoteLineItem): number {
  return Math.round(item.quantity * item.unitPrice * 100) / 100;
}

export function quoteGrandTotal(items: QuoteLineItem[]): number {
  return Math.round(items.reduce((s, i) => s + lineItemTotal(i), 0) * 100) / 100;
}

export function defaultLineItem(): QuoteLineItem {
  return { description: "", quantity: 1, unitPrice: 0 };
}

export const DEFAULT_QUOTE_TERMS = `• Fiyatlar KDV dahil değildir (aksi belirtilmedikçe).
• Teklif geçerlilik süresi belirtilen tarihe kadardır.
• Ödeme: kapıda nakit/kart veya havale (mutabakata göre).
• Teslim süresi iş yoğunluğuna göre değişebilir; kesin tarih onay sonrası yazılır.
• FINAL3D, teknik uygunluk için ölçüm ve dosya kontrolü yapma hakkını saklı tutar.`;

export function emptyScanQuote(): ScanQuoteDocument {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
  }).format(new Date());
  return {
    quoteNo: generateQuoteNo("scan"),
    issuedAt: today,
    validUntil: addValidDays(today, 14),
    client: { name: "", email: "", phone: "", company: "" },
    objectDescription: "",
    scanArea: "",
    quantity: "1",
    locationType: "studio",
    locationAddress: "",
    city: "",
    purpose: "print",
    surfaceType: "standard",
    wantsPrint: false,
    clientNote: "",
    lineItems: [
      { description: "3D tarama hizmeti", quantity: 1, unitPrice: 0 },
      { description: "Dijital model hazırlığı", quantity: 1, unitPrice: 0 },
    ],
    adminNote: "",
    terms: DEFAULT_QUOTE_TERMS,
  };
}

export function emptyCustomPrintQuote(): CustomPrintQuoteDocument {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
  }).format(new Date());
  return {
    quoteNo: generateQuoteNo("custom"),
    issuedAt: today,
    validUntil: addValidDays(today, 14),
    client: { name: "", email: "", phone: "" },
    material: "pla",
    color: "",
    quantity: "1",
    fileName: "",
    clientNote: "",
    lineItems: [
      { description: "3D baskı üretimi (filament)", quantity: 1, unitPrice: 0 },
      { description: "Kalite kontrol & paketleme", quantity: 1, unitPrice: 0 },
    ],
    adminNote: "",
    terms: DEFAULT_QUOTE_TERMS,
  };
}
