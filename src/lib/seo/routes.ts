import type { KktcCityId } from "@/lib/seo/constants";

export const SEO_HUB_SLUGS = [
  "3d-baski-kktc",
  "3d-tarama-kktc",
  "3d-modelleme-kktc",
  "prototip-uretim-kibris",
] as const;

export type SeoHubSlug = (typeof SEO_HUB_SLUGS)[number];

export const SEO_SERVICE_SLUGS = [
  "3d-baski",
  "3d-tarama",
  "prototip-uretim",
  "mimari-maket",
  "yedek-parca-uretimi",
  "endustriyel-uretim",
  "kisisel-uretim",
] as const;

export type SeoServiceSlug = (typeof SEO_SERVICE_SLUGS)[number];

export const CITY_PAGE_SLUGS: Record<KktcCityId, string> = {
  lefkosa: "lefkosa-3d-baski",
  girne: "girne-3d-baski",
  gazimagusa: "gazimagusa-3d-baski",
  guzelyurt: "guzelyurt-3d-baski",
  iskele: "iskele-3d-baski",
};

export const SEO_CITY_SLUGS = Object.values(CITY_PAGE_SLUGS);

export const PUBLIC_STATIC_PATHS = [
  "/",
  "/urunler",
  "/ozel-baski",
  "/3d-tarama",
  "/3d-tarama/teklif",
  "/blog",
  "/sss",
  "/iletisim",
  ...SEO_HUB_SLUGS.map((s) => `/${s}`),
  ...SEO_CITY_SLUGS.map((s) => `/kktc/${s}`),
  ...SEO_SERVICE_SLUGS.map((s) => `/hizmetler/${s}`),
] as const;

export const NOINDEX_PATH_PREFIXES = [
  "/admin",
  "/giris",
  "/kayit-ol",
  "/hesabim",
  "/order",
] as const;
