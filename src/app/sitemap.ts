import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { withLocale } from "@/lib/locale-path";
import { BLOG_TOPICS } from "@/lib/seo/blog-topics";
import { SITE_HOST } from "@/lib/seo/constants";
import { PUBLIC_STATIC_PATHS } from "@/lib/seo/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    ...PUBLIC_STATIC_PATHS,
    ...BLOG_TOPICS.map((t) => `/blog/${t.slug}`),
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const loc of locales) {
    for (const path of paths) {
      const url = `${SITE_HOST}${withLocale(path, loc)}`;
      const isBlog = path.startsWith("/blog/");
      const isHub = path.includes("kktc") || path.startsWith("/hizmetler");
      entries.push({
        url,
        lastModified: now,
        changeFrequency: isBlog ? "weekly" : isHub ? "monthly" : "weekly",
        priority: path === "/" ? 1 : isHub ? 0.85 : isBlog ? 0.7 : 0.8,
      });
    }
  }

  return entries;
}
