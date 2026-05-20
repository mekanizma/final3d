import type { PrintMaterialId } from "@/lib/printMaterials";
import type {
  ScanLocationId,
  ScanPurposeId,
  ScanSurfaceId,
} from "@/lib/scanQuoteOptions";

const MATERIAL_TR: Record<PrintMaterialId, string> = {
  pla: "PLA",
  abs: "ABS",
  petg: "PETG",
  tpu: "TPU",
};

const LOCATION_TR: Record<ScanLocationId, string> = {
  studio: "Stüdyo tarama",
  onsite: "Saha / yerinde tarama",
};

const PURPOSE_TR: Record<ScanPurposeId, string> = {
  reverse: "Tersine mühendislik",
  prototype: "Prototip",
  archive: "Arşiv / dijitalleştirme",
  print: "3D baskı için model",
  quality: "Kalite kontrol",
  other: "Diğer",
};

const SURFACE_TR: Record<ScanSurfaceId, string> = {
  standard: "Standart yüzey",
  glossy: "Parlak / yansıtıcı",
  dark: "Koyu / siyah yüzey",
  transparent: "Şeffaf",
  mixed: "Karma yüzey",
};

export function materialLabelTr(id: string): string {
  return MATERIAL_TR[id as PrintMaterialId] ?? id.toUpperCase();
}

export function scanLocationLabelTr(id: string): string {
  return LOCATION_TR[id as ScanLocationId] ?? id;
}

export function scanPurposeLabelTr(id: string): string {
  return PURPOSE_TR[id as ScanPurposeId] ?? id;
}

export function scanSurfaceLabelTr(id: string): string {
  return SURFACE_TR[id as ScanSurfaceId] ?? id;
}
