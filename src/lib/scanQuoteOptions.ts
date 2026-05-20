export const SCAN_PURPOSES = [
  { id: "reverse", label: "Tersine mühendislik / yedek parça" },
  { id: "prototype", label: "Prototip ve ürün geliştirme" },
  { id: "archive", label: "Arşiv ve dijitalleştirme" },
  { id: "print", label: "3D baskı için model" },
  { id: "quality", label: "Kalite kontrol / ölçüm" },
  { id: "other", label: "Diğer" },
] as const;

export type ScanPurposeId = (typeof SCAN_PURPOSES)[number]["id"];

export const SCAN_LOCATIONS = [
  { id: "studio", label: "Stüdyomuzda (teslim veya getirme)" },
  { id: "onsite", label: "Saha — adresinizde tarama" },
] as const;

export type ScanLocationId = (typeof SCAN_LOCATIONS)[number]["id"];

export const SCAN_SURFACE_TYPES = [
  { id: "standard", label: "Standart / mat yüzey" },
  { id: "glossy", label: "Parlak veya aynalı" },
  { id: "dark", label: "Koyu veya siyah yüzey" },
  { id: "transparent", label: "Şeffaf / yarı saydam" },
  { id: "mixed", label: "Karma / detaylı geometri" },
] as const;

export type ScanSurfaceId = (typeof SCAN_SURFACE_TYPES)[number]["id"];
