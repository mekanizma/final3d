export const SCAN_PURPOSES = [
  { id: "reverse" },
  { id: "prototype" },
  { id: "archive" },
  { id: "print" },
  { id: "quality" },
  { id: "other" },
] as const;

export type ScanPurposeId = (typeof SCAN_PURPOSES)[number]["id"];

export const SCAN_LOCATIONS = [
  { id: "studio" },
  { id: "onsite" },
] as const;

export type ScanLocationId = (typeof SCAN_LOCATIONS)[number]["id"];

export const SCAN_SURFACE_TYPES = [
  { id: "standard" },
  { id: "glossy" },
  { id: "dark" },
  { id: "transparent" },
  { id: "mixed" },
] as const;

export type ScanSurfaceId = (typeof SCAN_SURFACE_TYPES)[number]["id"];
