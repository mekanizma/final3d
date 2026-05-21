import type {
  ScanCustomerType,
  ScanDetailLevel,
  ScanFileStatus,
  ScanObjectSize,
  ScanUrgency,
  ScanWorkType,
} from "@/lib/scanPricingCalculator";

export interface ScanPriceRange {
  min: number;
  max: number;
}

export interface ScanPricingConfig {
  ranges: {
    scan: Record<ScanObjectSize, ScanPriceRange>;
    modeling: Record<ScanDetailLevel, ScanPriceRange>;
    reverse: Record<ScanObjectSize, ScanPriceRange>;
    print: Record<ScanObjectSize, ScanPriceRange>;
  };
  multipliers: {
    detail: Record<ScanDetailLevel, number>;
    urgency: Record<ScanUrgency, number>;
    customer: Record<ScanCustomerType, number>;
    file: Record<ScanFileStatus, number>;
  };
  /** Önerilen fiyat = min + (max-min) × bu oran */
  recommendedShare: number;
}

export const DEFAULT_SCAN_PRICING_CONFIG: ScanPricingConfig = {
  ranges: {
    scan: {
      small: { min: 1000, max: 3000 },
      medium: { min: 3000, max: 8000 },
      large: { min: 8000, max: 25000 },
    },
    modeling: {
      low: { min: 2000, max: 5000 },
      medium: { min: 5000, max: 15000 },
      high: { min: 15000, max: 50000 },
    },
    reverse: {
      small: { min: 3000, max: 10000 },
      medium: { min: 10000, max: 25000 },
      large: { min: 25000, max: 80000 },
    },
    print: {
      small: { min: 1500, max: 4500 },
      medium: { min: 4500, max: 14000 },
      large: { min: 14000, max: 42000 },
    },
  },
  multipliers: {
    detail: { low: 0.8, medium: 1, high: 1.5 },
    urgency: { normal: 1, fast: 1.3, urgent: 1.7 },
    customer: { individual: 1, corporate: 1.2, industrial: 1.35 },
    file: {
      reference_yes: 1,
      reference_no: 1.12,
      broken_part: 1.22,
      has_dimensions: 0.92,
    },
  },
  recommendedShare: 0.62,
};

function num(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function parseRange(raw: unknown, fallback: ScanPriceRange): ScanPriceRange {
  const r =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const min = Math.max(0, num(r.min, fallback.min));
  const max = Math.max(min, num(r.max, fallback.max));
  return { min, max };
}

function parseRangeMap<K extends string>(
  raw: unknown,
  keys: K[],
  defaults: Record<K, ScanPriceRange>
): Record<K, ScanPriceRange> {
  const src =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const out = { ...defaults };
  for (const key of keys) {
    out[key] = parseRange(src[key], defaults[key]);
  }
  return out;
}

function parseMultMap<K extends string>(
  raw: unknown,
  keys: K[],
  defaults: Record<K, number>
): Record<K, number> {
  const src =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const out = { ...defaults };
  for (const key of keys) {
    const v = src[key];
    out[key] =
      typeof v === "number" && Number.isFinite(v) && v > 0 ? v : defaults[key];
  }
  return out;
}

export function parseScanPricingConfig(raw: unknown): ScanPricingConfig {
  const d = DEFAULT_SCAN_PRICING_CONFIG;
  if (!raw || typeof raw !== "object") return { ...d };

  const r = raw as Record<string, unknown>;
  const rangesRaw =
    r.ranges && typeof r.ranges === "object"
      ? (r.ranges as Record<string, unknown>)
      : {};
  const multRaw =
    r.multipliers && typeof r.multipliers === "object"
      ? (r.multipliers as Record<string, unknown>)
      : {};

  const share = num(r.recommendedShare, d.recommendedShare);

  return {
    ranges: {
      scan: parseRangeMap(
        rangesRaw.scan,
        ["small", "medium", "large"],
        d.ranges.scan
      ),
      modeling: parseRangeMap(
        rangesRaw.modeling,
        ["low", "medium", "high"],
        d.ranges.modeling
      ),
      reverse: parseRangeMap(
        rangesRaw.reverse,
        ["small", "medium", "large"],
        d.ranges.reverse
      ),
      print: parseRangeMap(
        rangesRaw.print,
        ["small", "medium", "large"],
        d.ranges.print
      ),
    },
    multipliers: {
      detail: parseMultMap(
        multRaw.detail,
        ["low", "medium", "high"],
        d.multipliers.detail
      ),
      urgency: parseMultMap(
        multRaw.urgency,
        ["normal", "fast", "urgent"],
        d.multipliers.urgency
      ),
      customer: parseMultMap(
        multRaw.customer,
        ["individual", "corporate", "industrial"],
        d.multipliers.customer
      ),
      file: parseMultMap(
        multRaw.file,
        [
          "reference_yes",
          "reference_no",
          "broken_part",
          "has_dimensions",
        ],
        d.multipliers.file
      ),
    },
    recommendedShare: Math.min(0.95, Math.max(0.1, share)),
  };
}

export function getBaseRange(
  config: ScanPricingConfig,
  workType: ScanWorkType,
  size: ScanObjectSize,
  detail: ScanDetailLevel
): ScanPriceRange {
  if (workType === "scan") return config.ranges.scan[size];
  if (workType === "modeling") return config.ranges.modeling[detail];
  if (workType === "reverse") return config.ranges.reverse[size];
  return config.ranges.print[size];
}
