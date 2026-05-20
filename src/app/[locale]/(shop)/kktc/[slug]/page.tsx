import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getCityPage, getCitySlugs } from "@/lib/seo/content/cities";
import { metadataFromContent } from "@/lib/seo/metadata-from-content";
import { SeoPageTemplate } from "@/components/seo/SeoPageTemplate";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return getCitySlugs().flatMap((slug) =>
    locales.map((locale) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const content = getCityPage(slug, isLocale(locale) ? locale : "tr");
  if (!content) return {};
  return metadataFromContent(content, locale);
}

export default async function CitySeoPage({ params }: Props) {
  const { locale, slug } = await params;
  const loc = isLocale(locale) ? locale : ("tr" as Locale);
  const content = getCityPage(slug, loc);
  if (!content) notFound();
  return <SeoPageTemplate content={content} locale={loc} />;
}
