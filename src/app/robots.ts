import type { MetadataRoute } from "next";
import { SITE_HOST } from "@/lib/seo/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/*/admin/",
          "/admin/",
          "/*/giris",
          "/*/kayit-ol",
          "/*/hesabim/",
          "/*/order",
        ],
      },
    ],
    sitemap: `${SITE_HOST}/sitemap.xml`,
    host: SITE_HOST,
  };
}
