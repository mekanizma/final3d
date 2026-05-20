import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { Scan3DSection } from "@/components/home/Scan3DSection";
import { getHubPage } from "@/lib/seo/content/hubs";
import { metadataFromContent } from "@/lib/seo/metadata-from-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const hub = getHubPage("3d-tarama-kktc", isLocale(locale) ? locale : "tr");
  if (hub) return metadataFromContent(hub, locale);
  return {
    title: "3D Tarama | FINAL3D",
    description: "Profesyonel 3D tarama — KKTC.",
  };
}

export default function Scan3DPage() {
  return <Scan3DSection />;
}
