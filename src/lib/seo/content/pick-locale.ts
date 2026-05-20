import { defaultLocale, type Locale } from "@/i18n/config";

export function pickLocale<T extends Record<string, unknown>>(
  map: Partial<Record<Locale, T>> & { tr: T },
  locale: Locale
): T {
  return map[locale] ?? map.en ?? map.tr ?? map[defaultLocale];
}
