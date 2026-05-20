import { isLocale, type Locale } from "@/i18n/config";
import { getSssPage } from "@/lib/seo/content/static-pages";
import { metadataFromContent } from "@/lib/seo/metadata-from-content";
import { SeoPageTemplate } from "@/components/seo/SeoPageTemplate";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const content = getSssPage(isLocale(locale) ? locale : "tr");
  return metadataFromContent(content, locale);
}

export default async function SssPage({ params }: Props) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : ("tr" as Locale);
  const content = getSssPage(loc);
  return <SeoPageTemplate content={content} locale={loc} />;
}
