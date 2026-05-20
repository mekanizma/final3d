import type { Locale } from "@/i18n/config";
import { pickLocale } from "@/lib/seo/content/pick-locale";
import type { SeoPageContent } from "@/lib/seo/types";

type StaticMap = Record<Locale, SeoPageContent>;

const sss: StaticMap = {
  tr: {
    path: "/sss",
    metaTitle: "Sık Sorulan Sorular | FINAL3D KKTC",
    metaDescription:
      "3D baskı, tarama, teslimat ve ödeme hakkında sık sorulan sorular. FINAL3D KKTC.",
    h1: "Sık Sorulan Sorular",
    intro: "3D baskı ve tarama hizmetlerimiz hakkında en çok sorulan soruları derledik.",
    sections: [],
    faq: [
      {
        question: "KKTC'nin hangi bölgelerine hizmet veriyorsunuz?",
        answer: "Lefkoşa, Girne, Gazimağusa, Güzelyurt ve İskele başta olmak üzere KKTC geneline teslimat sunuyoruz.",
      },
      {
        question: "Teklif almak için ne gerekiyor?",
        answer: "Özel baskı için STL/OBJ/3MF dosyası; tarama için nesne fotoğrafı ve boyut bilgisi yeterlidir.",
      },
      {
        question: "Ödeme seçenekleri nelerdir?",
        answer: "Kapıda ödeme ve sipariş sürecine uygun diğer yöntemler hakkında teklifte bilgi verilir.",
      },
      {
        question: "Üretim süresi ne kadar?",
        answer: "Parça boyutuna göre genellikle 24–72 saat; acil işler için WhatsApp'tan bilgi alın.",
      },
    ],
    cta: { href: "/iletisim", label: "İletişime geçin" },
    related: [
      { href: "/3d-baski-kktc", label: "3D baskı" },
      { href: "/3d-tarama-kktc", label: "3D tarama" },
    ],
  },
  en: {
    path: "/sss",
    metaTitle: "FAQ | FINAL3D TRNC",
    metaDescription: "Frequently asked questions about 3D printing and scanning in Northern Cyprus.",
    h1: "Frequently Asked Questions",
    intro: "Answers about our 3D printing and scanning services.",
    sections: [],
    faq: [
      { question: "Which areas do you serve?", answer: "We deliver across TRNC including Nicosia, Kyrenia and Famagusta." },
      { question: "How to get a quote?", answer: "Upload a 3D file or fill the scanning quote form." },
      { question: "Payment options?", answer: "Cash on delivery and other options are explained in your quote." },
      { question: "Lead time?", answer: "Typically 24–72 hours depending on part size." },
    ],
    cta: { href: "/iletisim", label: "Contact us" },
    related: [{ href: "/3d-baski-kktc", label: "3D printing" }],
  },
  ru: {
    path: "/sss",
    metaTitle: "FAQ FINAL3D",
    metaDescription: "Вопросы о 3D-печати.",
    h1: "Частые вопросы",
    intro: "Ответы о наших услугах.",
    sections: [],
    faq: [{ question: "Регионы доставки?", answer: "По всему ТРСК." }],
    cta: { href: "/iletisim", label: "Контакты" },
    related: [],
  },
  ar: {
    path: "/sss",
    metaTitle: "الأسئلة الشائعة FINAL3D",
    metaDescription: "أسئلة عن الطباعة ثلاثية الأبعاد.",
    h1: "الأسئلة الشائعة",
    intro: "إجابات عن خدماتنا.",
    sections: [],
    faq: [{ question: "مناطق التوصيل؟", answer: "جميع أنحاء شمال قبرص." }],
    cta: { href: "/iletisim", label: "اتصل بنا" },
    related: [],
  },
};

const iletisim: StaticMap = {
  tr: {
    path: "/iletisim",
    metaTitle: "İletişim | FINAL3D KKTC",
    metaDescription:
      "FINAL3D iletişim: telefon, e-posta, WhatsApp. 3D baskı ve tarama teklifi.",
    h1: "İletişim",
    intro: "Projeleriniz için bize ulaşın; aynı iş günü içinde geri dönüş hedefliyoruz.",
    sections: [
      {
        heading: "İletişim bilgileri",
        body: "Telefon: +90 533 839 82 93 · E-posta: info@final3d.tr · WhatsApp üzerinden dosya ve fotoğraf gönderebilirsiniz.",
      },
      {
        heading: "Teklif formları",
        body: "Özel baskı ve 3D tarama için web sitemizdeki formları doldurun; özet WhatsApp ile iletilir.",
      },
    ],
    faq: [],
    cta: { href: "/ozel-baski#talep-form", label: "Teklif formu" },
    related: [{ href: "/sss", label: "SSS" }],
  },
  en: {
    path: "/iletisim",
    metaTitle: "Contact | FINAL3D TRNC",
    metaDescription: "Contact FINAL3D for 3D printing and scanning quotes in Northern Cyprus.",
    h1: "Contact",
    intro: "Reach out for your project — we aim to respond the same business day.",
    sections: [
      { heading: "Details", body: "Phone: +90 533 839 82 93 · Email: info@final3d.tr" },
    ],
    faq: [],
    cta: { href: "/ozel-baski#talep-form", label: "Quote form" },
    related: [{ href: "/sss", label: "FAQ" }],
  },
  ru: {
    path: "/iletisim",
    metaTitle: "Контакты FINAL3D",
    metaDescription: "Связаться с FINAL3D.",
    h1: "Контакты",
    intro: "Свяжитесь с нами.",
    sections: [],
    faq: [],
    cta: { href: "/ozel-baski#talep-form", label: "Форма" },
    related: [],
  },
  ar: {
    path: "/iletisim",
    metaTitle: "اتصل FINAL3D",
    metaDescription: "تواصل مع FINAL3D.",
    h1: "اتصل بنا",
    intro: "تواصل معنا لمشروعك.",
    sections: [],
    faq: [],
    cta: { href: "/ozel-baski#talep-form", label: "نموذج" },
    related: [],
  },
};

const blogIndex: StaticMap = {
  tr: {
    path: "/blog",
    metaTitle: "Blog | 3D Baskı ve Tarama Rehberleri — FINAL3D",
    metaDescription:
      "KKTC 3D baskı, tarama ve prototipleme rehberleri. Uzman içerikler ve ipuçları.",
    h1: "FINAL3D Blog",
    intro: "3D üretim, tarama ve KKTC'de uygulama örnekleri üzerine rehberler.",
    sections: [],
    faq: [],
    cta: { href: "/ozel-baski#talep-form", label: "Projenize teklif alın" },
    related: [{ href: "/3d-baski-kktc", label: "3D baskı hub" }],
  },
  en: {
    path: "/blog",
    metaTitle: "Blog | 3D Printing Guides — FINAL3D",
    metaDescription: "Guides on 3D printing and scanning in TRNC.",
    h1: "FINAL3D Blog",
    intro: "Expert guides on 3D production in Northern Cyprus.",
    sections: [],
    faq: [],
    cta: { href: "/ozel-baski#talep-form", label: "Get a quote" },
    related: [],
  },
  ru: {
    path: "/blog",
    metaTitle: "Блог FINAL3D",
    metaDescription: "Статьи о 3D-печати.",
    h1: "Блог",
    intro: "Руководства по 3D.",
    sections: [],
    faq: [],
    cta: { href: "/ozel-baski#talep-form", label: "Расчёт" },
    related: [],
  },
  ar: {
    path: "/blog",
    metaTitle: "مدونة FINAL3D",
    metaDescription: "مقالات الطباعة ثلاثية الأبعاد.",
    h1: "المدونة",
    intro: "أدلة الإنتاج ثلاثي الأبعاد.",
    sections: [],
    faq: [],
    cta: { href: "/ozel-baski#talep-form", label: "عرض سعر" },
    related: [],
  },
};

export function getSssPage(locale: Locale) {
  return pickLocale(sss, locale);
}

export function getIletisimPage(locale: Locale) {
  return pickLocale(iletisim, locale);
}

export function getBlogIndexPage(locale: Locale) {
  return pickLocale(blogIndex, locale);
}
