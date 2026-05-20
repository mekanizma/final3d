import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { PUBLISHED_BLOG_SLUGS } from "@/lib/seo/blog-topics";
import { getBlogArticle } from "@/lib/seo/content/blog-articles";
import { createPageMetadata, absoluteUrl } from "@/lib/seo/metadata";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/JsonLd";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { NeonButton } from "@/components/ui/NeonButton";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return PUBLISHED_BLOG_SLUGS.flatMap((slug) =>
    locales.map((locale) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const article = getBlogArticle(slug, isLocale(locale) ? locale : "tr");
  if (!article) return {};
  return createPageMetadata({
    locale: isLocale(locale) ? locale : "tr",
    path: `/blog/${slug}`,
    title: article.metaTitle,
    description: article.metaDescription,
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const loc = isLocale(locale) ? locale : ("tr" as Locale);
  const article = getBlogArticle(slug, loc);
  if (!article) notFound();

  const url = absoluteUrl(loc, `/blog/${slug}`);

  return (
    <article className="pb-24 max-w-3xl mx-auto px-4 sm:px-6 pt-12">
      <JsonLd
        data={[
          articleJsonLd({
            title: article.h1,
            description: article.metaDescription,
            url,
            datePublished: article.datePublished,
          }),
          breadcrumbJsonLd([
            { name: "Blog", url: absoluteUrl(loc, "/blog") },
            { name: article.h1, url },
          ]),
        ]}
      />

      <LocaleLink
        href="/blog"
        className="text-xs text-violet-300/60 hover:text-cyan-300 mb-6 inline-block"
      >
        ← Blog
      </LocaleLink>

      <h1 className="text-3xl sm:text-4xl font-bold mb-4">{article.h1}</h1>
      <p className="text-violet-200/75 leading-relaxed mb-8">{article.intro}</p>

      {article.sections.map((s) => (
        <section key={s.heading} className="mb-8">
          <h2 className="text-xl font-semibold text-white/95 mb-2">{s.heading}</h2>
          <p className="text-violet-200/65 leading-relaxed text-sm sm:text-base">
            {s.body}
          </p>
        </section>
      ))}

      <LocaleLink href={article.cta.href} className="inline-block mt-4">
        <NeonButton size="lg">
          {article.cta.label}
          <ArrowRight className="w-4 h-4" />
        </NeonButton>
      </LocaleLink>
    </article>
  );
}
