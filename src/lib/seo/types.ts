import type { Locale } from "@/i18n/config";

export type SeoFaqItem = { question: string; answer: string };

export type SeoSection = { heading: string; body: string };

export type SeoRelatedLink = { href: string; label: string };

export type SeoPageContent = {
  path: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: SeoSection[];
  faq: SeoFaqItem[];
  cta: { href: string; label: string; secondaryHref?: string; secondaryLabel?: string };
  related: SeoRelatedLink[];
  keywords?: string[];
};

export type LocalizedSeoPage = Record<Locale, SeoPageContent>;
