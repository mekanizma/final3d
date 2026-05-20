import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

/** Path’e locale öneki ekler: `/urunler` + `en` → `/en/urunler` */
export function withLocale(path: string, locale: string): string {
  const loc = isLocale(locale) ? locale : defaultLocale;
  const raw = path.startsWith("/") ? path : `/${path}`;
  const parts = raw.split("/").filter(Boolean);
  if (parts[0] && isLocale(parts[0])) {
    return raw;
  }
  if (raw === "/") return `/${loc}`;
  return `/${loc}${raw}`;
}

/** pathname’den locale çıkarır: `/en/urunler` → `/urunler` */
export function stripLocalePath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (!parts[0] || !isLocale(parts[0])) return pathname.startsWith("/") ? pathname : `/${pathname}`;
  const rest = parts.slice(1).join("/");
  return rest ? `/${rest}` : "/";
}

export function getLocaleFromPathname(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  if (first && isLocale(first)) return first;
  return defaultLocale;
}
