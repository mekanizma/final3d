import type { ScanLocationId, ScanPurposeId, ScanSurfaceId } from "@/lib/scanQuoteOptions";

const SCAN_LOCATION: Record<ScanLocationId, string> = {
  studio: "Stüdyo (FINAL3D)",
  onsite: "Saha — müşteri adresinde",
};

const SCAN_PURPOSE: Record<ScanPurposeId, string> = {
  reverse: "Tersine mühendislik / yedek parça",
  prototype: "Prototip ve ürün geliştirme",
  archive: "Arşiv ve dijitalleştirme",
  print: "3D baskı için model",
  quality: "Kalite kontrol / ölçüm",
  other: "Diğer",
};

const SCAN_SURFACE: Record<ScanSurfaceId, string> = {
  standard: "Standart / mat yüzey",
  glossy: "Parlak veya aynalı",
  dark: "Koyu veya siyah yüzey",
  transparent: "Şeffaf / yarı saydam",
  mixed: "Karma / detaylı geometri",
};

const MATERIAL: Record<string, string> = {
  pla: "PLA",
  abs: "ABS",
  petg: "PETG",
  tpu: "TPU",
};

export function scanLocationLabel(id: ScanLocationId): string {
  return SCAN_LOCATION[id] ?? id;
}

export function scanPurposeLabel(id: ScanPurposeId): string {
  return SCAN_PURPOSE[id] ?? id;
}

export function scanSurfaceLabel(id: ScanSurfaceId): string {
  return SCAN_SURFACE[id] ?? id;
}

export function printMaterialLabel(id: string): string {
  return MATERIAL[id] ?? id;
}

export function formatQuoteDate(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return ymd;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
}
