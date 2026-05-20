import type { Locale } from "@/i18n/config";
import { BLOG_TOPICS } from "@/lib/seo/blog-topics";
import { pickLocale } from "@/lib/seo/content/pick-locale";

export type BlogArticle = {
  slug: string;
  datePublished: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: { heading: string; body: string }[];
  cta: { href: string; label: string };
};

type LocalizedArticle = Record<Locale, BlogArticle>;

const articles: Record<string, LocalizedArticle> = {
  "3d-printer-ile-neler-yapilir": {
    tr: {
      slug: "3d-printer-ile-neler-yapilir",
      datePublished: "2026-01-15",
      metaTitle: "3D Printer ile Neler Yapılır? | FINAL3D KKTC",
      metaDescription:
        "3D printer ile prototip, yedek parça, maket ve kişisel üretim örnekleri. KKTC'de profesyonel destek.",
      h1: "3D Printer ile Neler Yapılır?",
      intro:
        "3D baskı; tasarımı dijitalden fiziksel parçaya taşıyan üretim yöntemidir. KKTC'de küçük işletmelerden üniversite projelerine kadar geniş kullanım alanı vardır.",
      sections: [
        {
          heading: "Prototip ve ürün geliştirme",
          body: "Yeni ürün fikirlerini 24–72 saat içinde test parçasına dönüştürerek pazara giriş süresini kısaltırsınız.",
        },
        {
          heading: "Yedek parça ve onarım",
          body: "Üretimi durmuş plastik klips, kapak ve bağlantı parçaları 3D baskı ile yeniden üretilebilir.",
        },
        {
          heading: "Mimari ve sunum maketleri",
          body: "Ölçekli bina ve iç mekan maketleri müşteri sunumlarında güçlü etki yaratır.",
        },
      ],
      cta: { href: "/ozel-baski#talep-form", label: "Projeniz için teklif alın" },
    },
    en: {
      slug: "3d-printer-ile-neler-yapilir",
      datePublished: "2026-01-15",
      metaTitle: "What Can a 3D Printer Do? | FINAL3D TRNC",
      metaDescription: "Prototypes, spare parts, models and custom production in Northern Cyprus.",
      h1: "What Can You Do with a 3D Printer?",
      intro: "3D printing turns digital designs into physical parts — widely used for product development and repair in TRNC.",
      sections: [
        { heading: "Prototyping", body: "Validate designs with test parts in 24–72 hours." },
        { heading: "Spare parts", body: "Replace discontinued plastic components." },
        { heading: "Architectural models", body: "Scale models for client presentations." },
      ],
      cta: { href: "/ozel-baski#talep-form", label: "Get a quote" },
    },
    ru: {
      slug: "3d-printer-ile-neler-yapilir",
      datePublished: "2026-01-15",
      metaTitle: "Что можно печатать на 3D-принтере?",
      metaDescription: "Прототипы и детали в ТРСК.",
      h1: "Что можно сделать на 3D-принтере?",
      intro: "3D-печать для прототипов и запчастей.",
      sections: [],
      cta: { href: "/ozel-baski#talep-form", label: "Расчёт" },
    },
    ar: {
      slug: "3d-printer-ile-neler-yapilir",
      datePublished: "2026-01-15",
      metaTitle: "ماذا يمكن طباعته بالثلاثي الأبعاد؟",
      metaDescription: "نماذج أولية وقطع في شمال قبرص.",
      h1: "ماذا يمكن عمله بالطباعة ثلاثية الأبعاد؟",
      intro: "الطباعة ثلاثية الأبعاد للنماذج والقطع.",
      sections: [],
      cta: { href: "/ozel-baski#talep-form", label: "عرض سعر" },
    },
  },
  "pla-abs-petg-farki": {
    tr: {
      slug: "pla-abs-petg-farki",
      datePublished: "2026-02-01",
      metaTitle: "PLA ABS PETG Farkı | Malzeme Rehberi FINAL3D",
      metaDescription: "PLA, ABS ve PETG ne zaman kullanılır? KKTC 3D baskı malzeme seçimi.",
      h1: "PLA, ABS ve PETG Arasındaki Farklar",
      intro: "Doğru filament seçimi parçanızın dayanımını ve yüzey kalitesini doğrudan etkiler.",
      sections: [
        { heading: "PLA", body: "Kolay baskı, sunum ve prototip için ideal; düşük ısıya dayanım." },
        { heading: "ABS", body: "Daha dayanıklı; mekanik parçalar için uygun, kapalı alan önerilir." },
        { heading: "PETG", body: "Kimyasal dirence iyi; dış mekan ve fonksiyonel parçalar." },
      ],
      cta: { href: "/ozel-baski#talep-form", label: "Malzeme seçimi için teklif" },
    },
    en: {
      slug: "pla-abs-petg-farki",
      datePublished: "2026-02-01",
      metaTitle: "PLA vs ABS vs PETG | FINAL3D",
      metaDescription: "Material guide for 3D printing in TRNC.",
      h1: "PLA, ABS and PETG Compared",
      intro: "Filament choice affects strength and surface quality.",
      sections: [
        { heading: "PLA", body: "Easy printing for prototypes." },
        { heading: "ABS", body: "Tougher mechanical parts." },
        { heading: "PETG", body: "Chemical resistance and outdoor use." },
      ],
      cta: { href: "/ozel-baski#talep-form", label: "Get quote" },
    },
    ru: {
      slug: "pla-abs-petg-farki",
      datePublished: "2026-02-01",
      metaTitle: "PLA ABS PETG",
      metaDescription: "Материалы для печати.",
      h1: "Сравнение материалов",
      intro: "Выбор филамента.",
      sections: [],
      cta: { href: "/ozel-baski#talep-form", label: "Расчёт" },
    },
    ar: {
      slug: "pla-abs-petg-farki",
      datePublished: "2026-02-01",
      metaTitle: "PLA و ABS و PETG",
      metaDescription: "دليل المواد.",
      h1: "مقارنة المواد",
      intro: "اختيار الفلامنت.",
      sections: [],
      cta: { href: "/ozel-baski#talep-form", label: "عرض سعر" },
    },
  },
};

/** Yayınlanmış makaleler için tam içerik; diğerleri listede kalır */
export function getBlogArticle(
  slug: string,
  locale: Locale
): BlogArticle | null {
  const entry = articles[slug];
  if (entry) return pickLocale(entry, locale);
  const topic = BLOG_TOPICS.find((t) => t.slug === slug && t.published);
  if (!topic) return null;
  const title = topic.titles[locale] ?? topic.titles.tr;
  return {
    slug,
    datePublished: "2026-03-01",
    metaTitle: `${title} | FINAL3D`,
    metaDescription: `${title} — KKTC 3D baskı ve tarama rehberi. FINAL3D ile teklif alın.`,
    h1: title,
    intro:
      locale === "en"
        ? "This guide is being expanded. Contact FINAL3D for a quote on your project in Northern Cyprus."
        : "Bu rehber genişletiliyor. Projeniz için FINAL3D'den teklif alabilirsiniz.",
    sections: [],
    cta: { href: "/ozel-baski#talep-form", label: locale === "en" ? "Get quote" : "Teklif alın" },
  };
}
