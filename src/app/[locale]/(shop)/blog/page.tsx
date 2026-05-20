import { isLocale, type Locale } from "@/i18n/config";
import { BLOG_TOPICS } from "@/lib/seo/blog-topics";
import { getBlogIndexPage } from "@/lib/seo/content/static-pages";
import { metadataFromContent } from "@/lib/seo/metadata-from-content";
import { LocaleLink } from "@/components/i18n/LocaleLink";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const content = getBlogIndexPage(isLocale(locale) ? locale : "tr");
  return metadataFromContent(content, locale);
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : ("tr" as Locale);
  const content = getBlogIndexPage(loc);

  const clusters = [...new Set(BLOG_TOPICS.map((t) => t.cluster))];

  return (
    <div className="pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">{content.h1}</h1>
      <p className="text-violet-200/70 mb-10 leading-relaxed">{content.intro}</p>

      {clusters.map((cluster) => (
        <section key={cluster} className="mb-10">
          <h2 className="text-lg font-semibold text-cyan-100/90 mb-4">{cluster}</h2>
          <ul className="space-y-2">
            {BLOG_TOPICS.filter((t) => t.cluster === cluster).map((topic) => {
              const title = topic.titles[loc] ?? topic.titles.tr;
              return (
                <li key={topic.slug}>
                  {topic.published ? (
                    <LocaleLink
                      href={`/blog/${topic.slug}`}
                      className="text-sm text-violet-100/85 hover:text-cyan-300 transition-colors flex items-center gap-2"
                    >
                      <span>{title}</span>
                      <span className="text-[10px] uppercase tracking-wide text-emerald-400/80">
                        {loc === "en" ? "Live" : "Yayında"}
                      </span>
                    </LocaleLink>
                  ) : (
                    <span className="text-sm text-violet-300/45 flex items-center gap-2">
                      {title}
                      <span className="text-[10px] uppercase tracking-wide">
                        {loc === "en" ? "Soon" : "Yakında"}
                      </span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
