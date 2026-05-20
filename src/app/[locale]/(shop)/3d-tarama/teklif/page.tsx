import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { ScanQuoteForm } from "@/components/scan/ScanQuoteForm";
import { createPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "tr";
  const titles: Record<string, { title: string; desc: string }> = {
    tr: {
      title: "3D Tarama Teklif Formu",
      desc: "3D tarama teklif formu — nesne, konum ve referans fotoğraf ile talep oluşturun.",
    },
    en: {
      title: "3D Scanning Quote Form",
      desc: "Request a 3D scanning quote with object details and photos.",
    },
    ru: {
      title: "Заявка на 3D-сканирование",
      desc: "Форма заявки на сканирование.",
    },
    ar: {
      title: "نموذج عرض سعر المسح",
      desc: "طلب عرض سعر للمسح ثلاثي الأبعاد.",
    },
  };
  const m = titles[loc] ?? titles.tr;
  return createPageMetadata({
    locale: loc,
    path: "/3d-tarama/teklif",
    title: m.title,
    description: m.desc,
  });
}

export default function ScanQuotePage() {
  return <ScanQuoteForm />;
}
