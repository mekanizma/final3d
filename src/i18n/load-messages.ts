import type { Locale } from "@/i18n/config";
import { en } from "@/i18n/tables/en";
import { tr } from "@/i18n/tables/tr";
import { ru } from "@/i18n/tables/ru";
import { ar } from "@/i18n/tables/ar";

const map: Record<Locale, Record<string, unknown>> = {
  tr: tr as Record<string, unknown>,
  en: en as Record<string, unknown>,
  ru: ru as Record<string, unknown>,
  ar: ar as Record<string, unknown>,
};

export function loadMessages(locale: Locale): Record<string, unknown> {
  return map[locale];
}
