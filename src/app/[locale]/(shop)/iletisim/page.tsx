import { isLocale, type Locale } from "@/i18n/config";
import { getIletisimPage } from "@/lib/seo/content/static-pages";
import { metadataFromContent } from "@/lib/seo/metadata-from-content";
import { SeoPageTemplate } from "@/components/seo/SeoPageTemplate";
import { Mail, MapPin, Phone } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp/openWhatsApp";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const content = getIletisimPage(isLocale(locale) ? locale : "tr");
  return metadataFromContent(content, locale);
}

export default async function IletisimPage({ params }: Props) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : ("tr" as Locale);
  const content = getIletisimPage(loc);
  const waUrl = buildWhatsAppUrl(
    loc === "en"
      ? "Hello FINAL3D, I would like a quote."
      : "Merhaba FINAL3D, teklif almak istiyorum."
  );

  return (
    <>
      <SeoPageTemplate content={content} locale={loc} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-12 pb-24">
        <div className="grid sm:grid-cols-3 gap-4">
          <a
            href={`tel:+${WHATSAPP_NUMBER}`}
            className="glass rounded-xl p-4 flex items-center gap-3 hover:border-cyan-400/30 transition-colors"
          >
            <Phone className="w-5 h-5 text-cyan-300 shrink-0" />
            <span className="text-sm text-violet-100/90">+90 533 839 82 93</span>
          </a>
          <a
            href="mailto:info@final3d.tr"
            className="glass rounded-xl p-4 flex items-center gap-3 hover:border-cyan-400/30 transition-colors"
          >
            <Mail className="w-5 h-5 text-cyan-300 shrink-0" />
            <span className="text-sm text-violet-100/90">info@final3d.tr</span>
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-xl p-4 flex items-center gap-3 hover:border-emerald-400/30 transition-colors"
          >
            <MapPin className="w-5 h-5 text-emerald-300 shrink-0" />
            <span className="text-sm text-violet-100/90">WhatsApp</span>
          </a>
        </div>
      </div>
    </>
  );
}
