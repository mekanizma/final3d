import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getServicePage } from "@/lib/seo/content/services";
import { metadataFromContent } from "@/lib/seo/metadata-from-content";
import { SEO_SERVICE_SLUGS } from "@/lib/seo/routes";
import { SeoPageTemplate } from "@/components/seo/SeoPageTemplate";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return SEO_SERVICE_SLUGS.flatMap((slug) =>
    locales.map((locale) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const content = getServicePage(slug, isLocale(locale) ? locale : "tr");
  if (!content) return {};
  return metadataFromContent(content, locale);
}

export default async function ServiceSeoPage({ params }: Props) {
  const { locale, slug } = await params;
  const loc = isLocale(locale) ? locale : ("tr" as Locale);
  const content = getServicePage(slug, loc);
  if (!content) notFound();
  return <SeoPageTemplate content={content} locale={loc} />;
}
