import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getHubPage } from "@/lib/seo/content/hubs";
import { metadataFromContent } from "@/lib/seo/metadata-from-content";
import { SeoPageTemplate } from "@/components/seo/SeoPageTemplate";
import type { SeoHubSlug } from "@/lib/seo/routes";

type Props = {
  slug: SeoHubSlug;
  params: Promise<{ locale: string }>;
};

export async function generateHubMetadata({ slug, params }: Props) {
  const { locale } = await params;
  const content = getHubPage(slug, isLocale(locale) ? locale : "tr");
  if (!content) return {};
  return metadataFromContent(content, locale);
}

export async function SeoHubPage({ slug, params }: Props) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : ("tr" as Locale);
  const content = getHubPage(slug, loc);
  if (!content) notFound();
  return <SeoPageTemplate content={content} locale={loc} />;
}
