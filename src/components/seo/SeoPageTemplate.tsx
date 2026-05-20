import { ArrowRight, ChevronRight } from "lucide-react";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { isLocale, type Locale } from "@/i18n/config";
import { absoluteUrl } from "@/lib/seo/metadata";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  serviceJsonLd,
} from "@/lib/seo/json-ld";
import type { SeoPageContent } from "@/lib/seo/types";

type SeoPageTemplateProps = {
  content: SeoPageContent;
  locale: string;
  breadcrumbLabels?: { home: string };
};

export function SeoPageTemplate({
  content,
  locale,
  breadcrumbLabels = { home: "Ana Sayfa" },
}: SeoPageTemplateProps) {
  const loc = isLocale(locale) ? locale : ("tr" as Locale);
  const pageUrl = absoluteUrl(loc, content.path);

  const breadcrumbs = breadcrumbJsonLd([
    { name: breadcrumbLabels.home, url: absoluteUrl(loc, "/") },
    { name: content.h1, url: pageUrl },
  ]);

  return (
    <article className="pb-24">
      <JsonLd
        data={[
          serviceJsonLd(content.h1, content.intro, pageUrl),
          faqPageJsonLd(content.faq),
          breadcrumbs,
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <nav
          className="flex items-center gap-1 text-xs text-violet-300/55 mb-6 flex-wrap"
          aria-label="Breadcrumb"
        >
          <LocaleLink href="/" className="hover:text-cyan-300">
            {breadcrumbLabels.home}
          </LocaleLink>
          <ChevronRight className="w-3 h-3 shrink-0" aria-hidden />
          <span className="text-violet-100/80">{content.h1}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-white">
          {content.h1}
        </h1>
        <p className="text-violet-200/75 text-base sm:text-lg leading-relaxed mb-8">
          {content.intro}
        </p>

        <div className="flex flex-wrap gap-3 mb-12">
          <LocaleLink href={content.cta.href}>
            <NeonButton size="lg">
              {content.cta.label}
              <ArrowRight className="w-4 h-4" />
            </NeonButton>
          </LocaleLink>
          {content.cta.secondaryHref && content.cta.secondaryLabel && (
            <LocaleLink href={content.cta.secondaryHref}>
              <NeonButton variant="ghost" size="lg">
                {content.cta.secondaryLabel}
              </NeonButton>
            </LocaleLink>
          )}
        </div>

        {content.sections.map((section) => (
          <section key={section.heading} className="mb-10">
            <h2 className="text-xl font-semibold text-white/95 mb-3">
              {section.heading}
            </h2>
            <p className="text-violet-200/65 leading-relaxed text-sm sm:text-base">
              {section.body}
            </p>
          </section>
        ))}

        {content.faq.length > 0 && (
          <GlassCard hover={false} className="p-6 sm:p-8 mb-10">
            <h2 className="text-lg font-bold mb-5 text-white">SSS</h2>
            <dl className="space-y-5">
              {content.faq.map((item) => (
                <div key={item.question}>
                  <dt className="font-semibold text-cyan-100/90 text-sm mb-1">
                    {item.question}
                  </dt>
                  <dd className="text-sm text-violet-200/60 leading-relaxed">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </GlassCard>
        )}

        {content.related.length > 0 && (
          <nav className="border-t border-white/10 pt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-violet-300/60 mb-4">
              İlgili sayfalar
            </h2>
            <ul className="flex flex-wrap gap-2">
              {content.related.map((link) => (
                <li key={link.href}>
                  <LocaleLink
                    href={link.href}
                    className="inline-block text-sm px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-violet-100/85 hover:border-cyan-400/40 hover:text-cyan-200 transition-colors"
                  >
                    {link.label}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </article>
  );
}
