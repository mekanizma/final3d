import type { Locale } from "@/i18n/config";
import { mergeMessages } from "@/i18n/merge-messages";
import { en } from "@/i18n/tables/en";
import { tr } from "@/i18n/tables/tr";
import { ru } from "@/i18n/tables/ru";
import { ar } from "@/i18n/tables/ar";
import { enExtended } from "@/i18n/tables/extended/en";
import { trExtended } from "@/i18n/tables/extended/tr";
import { ruExtended } from "@/i18n/tables/extended/ru";
import { arExtended } from "@/i18n/tables/extended/ar";

const base: Record<Locale, Record<string, unknown>> = {
  tr: tr as Record<string, unknown>,
  en: en as Record<string, unknown>,
  ru: ru as Record<string, unknown>,
  ar: ar as Record<string, unknown>,
};

const extended: Record<Locale, Record<string, unknown>> = {
  tr: trExtended as Record<string, unknown>,
  en: enExtended as Record<string, unknown>,
  ru: ruExtended as Record<string, unknown>,
  ar: arExtended as Record<string, unknown>,
};

export function loadMessages(locale: Locale): Record<string, unknown> {
  return mergeMessages(base[locale], extended[locale]);
}
