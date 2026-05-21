import { locales, type Locale } from "@/i18n/config";

export const SITE_NAME = "FINAL3D";
export const SITE_HOST =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://final3d.tr";

export const SITE_LOGO_PATH = "/logo.svg";

export const SITE_PHONE = "+905338398293";
export const SITE_EMAIL = "info@final3d.tr";

export const KKTC_CITIES = [
  "lefkosa",
  "girne",
  "gazimagusa",
  "guzelyurt",
  "iskele",
] as const;

export type KktcCityId = (typeof KKTC_CITIES)[number];

export const SEO_LOCALES = locales;

export type { Locale };
