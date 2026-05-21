import {
  addValidDays,
  emptyScanQuote,
  generateQuoteNo,
  type QuoteLineItem,
  type ScanQuoteDocument,
} from "@/lib/billing/quoteTypes";
import type {
  ScanPricingBreakdown,
  ScanPricingInputs,
} from "@/lib/scanPricingCalculator";
import { formatScanPricingReport } from "@/lib/scanPricingCalculator";

export const SCAN_PRICING_QUOTE_STORAGE_KEY = "final3d_scan_pricing_quote_draft";

export interface ScanPricingQuoteDraft {
  inputs: ScanPricingInputs;
  breakdown: ScanPricingBreakdown;
  createdAt: string;
}

const SIZE_SCAN_AREA: Record<ScanPricingInputs["objectSize"], string> = {
  small: "Küçük parça / obje",
  medium: "Orta boy parça",
  large: "Büyük parça / endüstriyel ölçek",
};

export function buildScanQuoteFromPricing(
  inputs: ScanPricingInputs,
  breakdown: ScanPricingBreakdown
): ScanQuoteDocument {
  const doc = emptyScanQuote();
  doc.quoteNo = generateQuoteNo("scan");
  doc.objectDescription = breakdown.summary;
  if (inputs.notes?.trim()) {
    doc.objectDescription += `\n${inputs.notes.trim()}`;
  }
  doc.scanArea = SIZE_SCAN_AREA[inputs.objectSize];
  doc.clientNote = "";
  doc.lineItems = buildLineItemsFromBreakdown(breakdown);
  doc.adminNote = [
    "— Fiyat robotu özeti —",
    formatScanPricingReport(inputs, breakdown),
    "",
    `Tahmini süre: ${breakdown.durationLabel}`,
  ].join("\n");
  doc.terms = `${doc.terms}\n• Bu teklif, keşif ve dosya incelemesi sonrası kesinleşir; robot çıktısı ön fiyat aralığıdır.`;
  return doc;
}

function buildLineItemsFromBreakdown(
  b: ScanPricingBreakdown
): QuoteLineItem[] {
  const items: QuoteLineItem[] = [];
  if (b.scanPortion > 0) {
    items.push({
      description: "3D tarama hizmeti",
      quantity: 1,
      unitPrice: b.scanPortion,
    });
  }
  if (b.modelingPortion > 0) {
    items.push({
      description: "3D modelleme / CAD",
      quantity: 1,
      unitPrice: b.modelingPortion,
    });
  }
  if (b.editingPortion > 0) {
    items.push({
      description: "Dijital model hazırlığı ve düzenleme",
      quantity: 1,
      unitPrice: b.editingPortion,
    });
  }
  if (items.length === 0) {
    items.push({
      description: "3D hizmet paketi",
      quantity: 1,
      unitPrice: b.recommendedPrice,
    });
  }
  return items;
}

export function saveScanPricingQuoteDraft(draft: ScanPricingQuoteDraft): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(SCAN_PRICING_QUOTE_STORAGE_KEY, JSON.stringify(draft));
}

export function consumeScanPricingQuoteDraft(): ScanPricingQuoteDraft | null {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(SCAN_PRICING_QUOTE_STORAGE_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(SCAN_PRICING_QUOTE_STORAGE_KEY);
  try {
    const parsed = JSON.parse(raw) as ScanPricingQuoteDraft;
    if (!parsed?.inputs || !parsed?.breakdown) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function formatCustomerOfferMessage(
  inputs: ScanPricingInputs,
  b: ScanPricingBreakdown,
  clientName?: string
): string {
  const greet = clientName?.trim()
    ? `Merhaba ${clientName.trim()},`
    : "Merhaba,";
  return [
    greet,
    "",
    "Final3d olarak projeniz için ön fiyat bilgisini paylaşıyoruz:",
    "",
    `📋 ${b.summary}`,
    `💰 Önerilen teklif: ${b.recommendedPrice.toLocaleString("tr-TR")} TL`,
    `📊 Aralık: ${b.minPrice.toLocaleString("tr-TR")} – ${b.maxPrice.toLocaleString("tr-TR")} TL`,
    `⏱ Tahmini süre: ${b.durationLabel}`,
    "",
    "Kesin fiyat; parça incelemesi, dosya/ölçü kontrolü ve kapsam netleştikten sonra teyit edilir.",
    "Sorularınız için bu mesaja yanıt verebilirsiniz.",
    "",
    "Saygılarımızla,",
    "Final3d",
  ].join("\n");
}

export function buildCustomerMailto(
  message: string,
  email?: string
): string {
  const to = email?.trim() || "";
  const subject = encodeURIComponent("Final3d — 3D Tarama / Modelleme Ön Teklif");
  const body = encodeURIComponent(message);
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
