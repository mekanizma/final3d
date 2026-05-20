export const locales = ["tr", "en", "ru", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export const localeLabels: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ru: "Русский",
  ar: "العربية",
};

export function isLocale(s: string): s is Locale {
  return (locales as readonly string[]).includes(s);
}
