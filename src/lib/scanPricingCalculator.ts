/** 3D tarama / modelleme / RE / baskı hizmet fiyatı — kural tabanlı hesap */

import {
  DEFAULT_SCAN_PRICING_CONFIG,
  getBaseRange,
  type ScanPriceRange,
  type ScanPricingConfig,
} from "@/lib/scanPricingConfig";

export type ScanWorkType = "scan" | "modeling" | "reverse" | "print";
export type ScanObjectSize = "small" | "medium" | "large";
export type ScanDetailLevel = "low" | "medium" | "high";
export type ScanUrgency = "normal" | "fast" | "urgent";
export type ScanFileStatus =
  | "reference_yes"
  | "reference_no"
  | "broken_part"
  | "has_dimensions";
export type ScanCustomerType = "individual" | "corporate" | "industrial";

export interface ScanPricingInputs {
  workType: ScanWorkType;
  objectSize: ScanObjectSize;
  detailLevel: ScanDetailLevel;
  urgency: ScanUrgency;
  fileStatus: ScanFileStatus;
  customerType: ScanCustomerType;
  estimatedHours?: number;
  notes?: string;
}

export interface ScanPricingBreakdown {
  summary: string;
  minPrice: number;
  maxPrice: number;
  recommendedPrice: number;
  scanPortion: number;
  modelingPortion: number;
  editingPortion: number;
  multiplierDelta: number;
  baseMid: number;
  durationHoursMin: number;
  durationHoursMax: number;
  durationLabel: string;
  rationale: string;
  detailMultiplier: number;
  urgencyMultiplier: number;
  customerMultiplier: number;
  fileMultiplier: number;
}

export const SCAN_PRICING_DEFAULTS: ScanPricingInputs = {
  workType: "scan",
  objectSize: "medium",
  detailLevel: "medium",
  urgency: "normal",
  fileStatus: "reference_yes",
  customerType: "individual",
};

function roundTl(n: number): number {
  return Math.round(n / 10) * 10;
}

function combinedMultiplier(
  inputs: ScanPricingInputs,
  config: ScanPricingConfig
): number {
  const m = config.multipliers;
  return (
    m.detail[inputs.detailLevel] *
    m.urgency[inputs.urgency] *
    m.customer[inputs.customerType] *
    m.file[inputs.fileStatus]
  );
}

function workSummary(inputs: ScanPricingInputs): string {
  const type: Record<ScanWorkType, string> = {
    scan: "3D tarama",
    modeling: "3D modelleme (CAD)",
    reverse: "Reverse engineering (tarama + modelleme)",
    print: "3D baskı hizmeti",
  };
  const size: Record<ScanObjectSize, string> = {
    small: "küçük ölçek",
    medium: "orta ölçek",
    large: "büyük / endüstriyel ölçek",
  };
  return `${type[inputs.workType]} — ${size[inputs.objectSize]} obje, ${inputs.detailLevel === "low" ? "düşük" : inputs.detailLevel === "medium" ? "orta" : "yüksek"} detay`;
}

function splitPortions(
  workType: ScanWorkType,
  midAfterFile: number,
  detail: ScanDetailLevel
): { scan: number; modeling: number; editing: number } {
  const editingRate =
    detail === "high" ? 0.12 : detail === "medium" ? 0.08 : 0.05;
  const editing = roundTl(midAfterFile * editingRate);

  if (workType === "scan") {
    return { scan: roundTl(midAfterFile - editing), modeling: 0, editing };
  }
  if (workType === "modeling") {
    return { scan: 0, modeling: roundTl(midAfterFile - editing), editing };
  }
  if (workType === "reverse") {
    const rest = midAfterFile - editing;
    return {
      scan: roundTl(rest * 0.42),
      modeling: roundTl(rest * 0.5),
      editing,
    };
  }
  return { scan: 0, modeling: 0, editing: roundTl(midAfterFile * 0.15) };
}

function durationEstimate(
  inputs: ScanPricingInputs
): { hoursMin: number; hoursMax: number; label: string } {
  if (
    inputs.estimatedHours != null &&
    Number.isFinite(inputs.estimatedHours) &&
    inputs.estimatedHours > 0
  ) {
    const h = inputs.estimatedHours;
    const label =
      h >= 8
        ? `${Math.ceil(h / 8)}–${Math.ceil((h * 1.25) / 8)} iş günü (${h} saat girildi)`
        : `${h}–${Math.ceil(h * 1.3)} saat (müşteri tahmini)`;
    return { hoursMin: h, hoursMax: Math.ceil(h * 1.3), label };
  }

  const sizeFactor: Record<ScanObjectSize, number> = {
    small: 1,
    medium: 1.8,
    large: 3.2,
  };
  const f = sizeFactor[inputs.objectSize];
  const baseHours: Record<ScanWorkType, [number, number]> = {
    scan: [4, 10],
    modeling: [8, 24],
    reverse: [16, 48],
    print: [6, 20],
  };
  const [lo, hi] = baseHours[inputs.workType];
  const detailBoost =
    inputs.detailLevel === "high" ? 1.4 : inputs.detailLevel === "low" ? 0.85 : 1;
  const hoursMin = Math.round(lo * f * detailBoost);
  const hoursMax = Math.round(hi * f * detailBoost);
  const daysMin = Math.max(1, Math.ceil(hoursMin / 8));
  const daysMax = Math.max(1, Math.ceil(hoursMax / 8));
  const label =
    hoursMax <= 12
      ? `${hoursMin}–${hoursMax} saat`
      : `${daysMin}–${daysMax} iş günü (≈ ${hoursMin}–${hoursMax} saat)`;
  return { hoursMin, hoursMax, label };
}

export function calculateScanPricing(
  inputs: ScanPricingInputs,
  config: ScanPricingConfig = DEFAULT_SCAN_PRICING_CONFIG
): ScanPricingBreakdown {
  const base: ScanPriceRange = getBaseRange(
    config,
    inputs.workType,
    inputs.objectSize,
    inputs.detailLevel
  );
  const mult = combinedMultiplier(inputs, config);
  const minPrice = roundTl(base.min * mult);
  const maxPrice = roundTl(base.max * mult);
  const recommendedPrice = roundTl(
    minPrice + (maxPrice - minPrice) * config.recommendedShare
  );

  const baseMid = (base.min + base.max) / 2;
  const fileMult = config.multipliers.file[inputs.fileStatus];
  const midAfterFile = baseMid * fileMult;
  const portions = splitPortions(
    inputs.workType,
    midAfterFile,
    inputs.detailLevel
  );

  const subtotalBeforeMult =
    portions.scan + portions.modeling + portions.editing;
  const multiplierDelta = roundTl(subtotalBeforeMult * (mult - 1));

  const { hoursMin, hoursMax, label } = durationEstimate(inputs);
  const m = config.multipliers;

  const urgencyNote =
    inputs.urgency === "urgent"
      ? "Acil teslim çarpanı uygulandı."
      : inputs.urgency === "fast"
        ? "Hızlı teslim çarpanı uygulandı."
        : "Standart teslim süresi.";

  const customerNote =
    inputs.customerType === "corporate"
      ? "Kurumsal müşteri çarpanı dahil."
      : inputs.customerType === "industrial"
        ? "Endüstriyel proje çarpanı dahil."
        : "Bireysel müşteri tarifesi.";

  const rationale = `${urgencyNote} ${customerNote} Önerilen fiyat, üst banda yakın olmayacak şekilde pazarlık payı bırakılarak hesaplandı.`;

  const share =
    subtotalBeforeMult > 0 ? recommendedPrice / subtotalBeforeMult : 0;

  return {
    summary: workSummary(inputs),
    minPrice,
    maxPrice,
    recommendedPrice,
    scanPortion: roundTl(portions.scan * share),
    modelingPortion: roundTl(portions.modeling * share),
    editingPortion: roundTl(portions.editing * share),
    multiplierDelta,
    baseMid: roundTl(baseMid),
    durationHoursMin: hoursMin,
    durationHoursMax: hoursMax,
    durationLabel: label,
    rationale,
    detailMultiplier: m.detail[inputs.detailLevel],
    urgencyMultiplier: m.urgency[inputs.urgency],
    customerMultiplier: m.customer[inputs.customerType],
    fileMultiplier: fileMult,
  };
}

export function formatScanPricingReport(
  inputs: ScanPricingInputs,
  b: ScanPricingBreakdown
): string {
  const lines = [
    "Final3d — 3D Tarama Fiyatlandırma",
    "",
    "1. İş özeti:",
    b.summary,
    inputs.notes?.trim() ? `Not: ${inputs.notes.trim()}` : null,
    "",
    "2. Hesaplanan fiyat:",
    `- Minimum: ${b.minPrice.toLocaleString("tr-TR")} TL`,
    `- Maksimum: ${b.maxPrice.toLocaleString("tr-TR")} TL`,
    `- Önerilen fiyat: ${b.recommendedPrice.toLocaleString("tr-TR")} TL`,
    "",
    "3. Fiyat kırılımı:",
    `- Tarama: ${b.scanPortion.toLocaleString("tr-TR")} TL`,
    `- Modelleme: ${b.modelingPortion.toLocaleString("tr-TR")} TL`,
    `- Düzenleme: ${b.editingPortion.toLocaleString("tr-TR")} TL`,
    `- Aciliyet / detay çarpanı etkisi: ${b.multiplierDelta >= 0 ? "+" : ""}${b.multiplierDelta.toLocaleString("tr-TR")} TL`,
    "",
    "4. Süre tahmini:",
    `- ${b.durationLabel}`,
    "",
    "5. Kısa açıklama:",
    b.rationale,
  ].filter((line): line is string => line != null);

  return lines.join("\n");
}
