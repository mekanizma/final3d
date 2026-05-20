import { isLocale, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { SeoPageContent } from "@/lib/seo/types";

export function metadataFromContent(
  content: SeoPageContent,
  localeParam: string
) {
  const locale = isLocale(localeParam) ? localeParam : ("tr" as Locale);
  return createPageMetadata({
    locale,
    path: content.path,
    title: content.metaTitle.replace(/\s*\|\s*FINAL3D.*$/i, "").trim(),
    description: content.metaDescription,
    keywords: content.keywords,
  });
}
