import type { Locale } from "@/i18n/config";
import type { KktcCityId } from "@/lib/seo/constants";
import { pickLocale } from "@/lib/seo/content/pick-locale";
import { CITY_PAGE_SLUGS } from "@/lib/seo/routes";
import type { LocalizedSeoPage, SeoPageContent } from "@/lib/seo/types";

type CityNames = Record<Locale, { name: string; region: string }>;

const cityNames: Record<KktcCityId, CityNames> = {
  lefkosa: {
    tr: { name: "Lefkoşa", region: "KKTC" },
    en: { name: "Nicosia", region: "TRNC" },
    ru: { name: "Никосия", region: "ТРСК" },
    ar: { name: "نيقوسيا", region: "شمال قبرص" },
  },
  girne: {
    tr: { name: "Girne", region: "KKTC" },
    en: { name: "Kyrenia", region: "TRNC" },
    ru: { name: "Кирения", region: "ТРСК" },
    ar: { name: "كيرينيا", region: "شمال قبرص" },
  },
  gazimagusa: {
    tr: { name: "Gazimağusa", region: "KKTC" },
    en: { name: "Famagusta", region: "TRNC" },
    ru: { name: "Фамагуста", region: "ТРСК" },
    ar: { name: "فاماغوستا", region: "شمال قبرص" },
  },
  guzelyurt: {
    tr: { name: "Güzelyurt", region: "KKTC" },
    en: { name: "Morphou", region: "TRNC" },
    ru: { name: "Морфу", region: "ТРСК" },
    ar: { name: "مورفو", region: "شمال قبرص" },
  },
  iskele: {
    tr: { name: "İskele", region: "KKTC" },
    en: { name: "Trikomo", region: "TRNC" },
    ru: { name: "Трикомо", region: "ТРСК" },
    ar: { name: "تريكومو", region: "شمال قبرص" },
  },
};

function buildCityPage(cityId: KktcCityId, locale: Locale): SeoPageContent {
  const slug = CITY_PAGE_SLUGS[cityId];
  const path = `/kktc/${slug}`;
  const { name, region } = cityNames[cityId][locale] ?? cityNames[cityId].tr;

  const copy: Record<Locale, Omit<SeoPageContent, "path">> = {
    tr: {
      metaTitle: `${name} 3D Baskı | Hızlı Teklif — FINAL3D`,
      metaDescription: `${name} ve çevresinde 3D baskı, tarama ve prototip. FINAL3D ile dosya gönderin, KKTC geneline teslimat.`,
      h1: `${name}'da 3D Baskı ve Üretim`,
      intro: `FINAL3D, ${name} bölgesinde özel parça üretimi, 3D tarama ve hızlı prototipleme sunar. ${region} genelinde kapıda ödeme ve güvenilir teslimat.`,
      sections: [
        {
          heading: `${name} için hizmetlerimiz`,
          body: "Özel filament baskı, el tipi 3D tarama, mimari maket ve yedek parça üretimi tek çatı altında.",
        },
        {
          heading: "Nasıl sipariş verilir?",
          body: "3D dosyanızı yükleyin veya tarama teklifi formunu doldurun; WhatsApp üzerinden hızlı geri dönüş alın.",
        },
      ],
      faq: [
        {
          question: `${name}'a teslimat yapıyor musunuz?`,
          answer: `Evet, ${name} ve ${region} genelinde teslimat sağlıyoruz.`,
        },
        {
          question: "Aynı gün teklif alabilir miyim?",
          answer: "Çoğu talebe aynı iş günü içinde ön fiyat ve süre bildiriyoruz.",
        },
      ],
      cta: {
        href: "/ozel-baski#talep-form",
        label: "Teklif Al",
        secondaryHref: "/3d-tarama/teklif",
        secondaryLabel: "Tarama Teklifi",
      },
      related: [
        { href: "/3d-baski-kktc", label: "3D baskı KKTC" },
        { href: "/3d-tarama-kktc", label: "3D tarama" },
      ],
      keywords: [`${name} 3d baskı`, "3d printer kktc", "özel baskı"],
    },
    en: {
      metaTitle: `${name} 3D Printing | Fast Quote — FINAL3D`,
      metaDescription: `3D printing and scanning in ${name}, ${region}. Upload your file for a quote.`,
      h1: `3D Printing in ${name}`,
      intro: `FINAL3D serves ${name} with custom FDM printing, scanning and prototyping across ${region}.`,
      sections: [
        { heading: "Services", body: "Custom print, handheld scanning, architectural models and spare parts." },
        { heading: "How to order", body: "Upload a file or request a scan quote — quick response via WhatsApp." },
      ],
      faq: [
        { question: `Do you deliver to ${name}?`, answer: `Yes, we deliver across ${name} and ${region}.` },
        { question: "Same-day quote?", answer: "Most requests receive a quote the same business day." },
      ],
      cta: {
        href: "/ozel-baski#talep-form",
        label: "Get quote",
        secondaryHref: "/3d-tarama/teklif",
        secondaryLabel: "Scan quote",
      },
      related: [
        { href: "/3d-baski-kktc", label: "3D printing TRNC" },
        { href: "/3d-tarama-kktc", label: "3D scanning" },
      ],
    },
    ru: {
      metaTitle: `3D-печать ${name} | FINAL3D`,
      metaDescription: `3D-печать и сканирование в ${name}.`,
      h1: `3D-печать в ${name}`,
      intro: `FINAL3D — печать и сканирование в ${name}.`,
      sections: [],
      faq: [{ question: "Доставка?", answer: "Да, по региону." }],
      cta: { href: "/ozel-baski#talep-form", label: "Расчёт" },
      related: [{ href: "/3d-baski-kktc", label: "3D-печать" }],
    },
    ar: {
      metaTitle: `طباعة 3D ${name} | FINAL3D`,
      metaDescription: `طباعة ومسح في ${name}.`,
      h1: `طباعة ثلاثية الأبعاد في ${name}`,
      intro: `FINAL3D في ${name}.`,
      sections: [],
      faq: [{ question: "التوصيل؟", answer: "نعم." }],
      cta: { href: "/ozel-baski#talep-form", label: "عرض سعر" },
      related: [{ href: "/3d-baski-kktc", label: "طباعة 3D" }],
    },
  };

  const body = pickLocale(copy, locale);
  return { path, ...body };
}

const slugToCity: Record<string, KktcCityId> = Object.fromEntries(
  (Object.entries(CITY_PAGE_SLUGS) as [KktcCityId, string][]).map(([id, slug]) => [
    slug,
    id,
  ])
) as Record<string, KktcCityId>;

export function getCityPage(slug: string, locale: Locale): SeoPageContent | null {
  const cityId = slugToCity[slug];
  if (!cityId) return null;
  return buildCityPage(cityId, locale);
}

export function getCitySlugs() {
  return Object.values(CITY_PAGE_SLUGS);
}
