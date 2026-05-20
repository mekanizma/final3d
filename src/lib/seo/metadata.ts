import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { withLocale } from "@/lib/locale-path";
import { SITE_HOST, SITE_NAME } from "@/lib/seo/constants";

type PageMetaInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function absoluteUrl(locale: Locale, path: string): string {
  const p = withLocale(path, locale);
  return `${SITE_HOST}${p === "/" ? "" : p}`;
}

export function createPageMetadata(input: PageMetaInput): Metadata {
  const { locale, path, title, description, keywords, noIndex } = input;
  const canonical = absoluteUrl(locale, path);

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = absoluteUrl(loc, path);
  }
  languages["x-default"] = absoluteUrl(defaultLocale, path);

  const fullTitle =
    title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    keywords,
    metadataBase: new URL(SITE_HOST),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      locale: locale === "tr" ? "tr_TR" : locale === "en" ? "en_US" : locale,
      url: canonical,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
