import { SITE_EMAIL, SITE_HOST, SITE_NAME, SITE_PHONE } from "@/lib/seo/constants";
import type { SeoFaqItem } from "@/lib/seo/types";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_HOST,
    email: SITE_EMAIL,
    telephone: SITE_PHONE,
    logo: `${SITE_HOST}/favicon.ico`,
    sameAs: [],
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${SITE_NAME} — 3D Baskı ve Tarama`,
    image: `${SITE_HOST}/favicon.ico`,
    url: SITE_HOST,
    telephone: SITE_PHONE,
    email: SITE_EMAIL,
    priceRange: "₺₺",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CY",
      addressRegion: "KKTC",
    },
    areaServed: [
      { "@type": "City", name: "Lefkoşa" },
      { "@type": "City", name: "Girne" },
      { "@type": "City", name: "Gazimağusa" },
      { "@type": "City", name: "Güzelyurt" },
      { "@type": "City", name: "İskele" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_HOST,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_HOST}/tr/urunler?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function serviceJsonLd(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_HOST },
    areaServed: "KKTC",
    url,
  };
}

export function faqPageJsonLd(faq: SeoFaqItem[]) {
  if (!faq.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.datePublished,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_HOST}/favicon.ico` },
    },
    mainEntityOfPage: input.url,
  };
}
