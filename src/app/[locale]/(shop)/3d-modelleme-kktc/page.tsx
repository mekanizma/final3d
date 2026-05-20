import { SeoHubPage, generateHubMetadata } from "@/components/seo/SeoHubPage";

type Props = { params: Promise<{ locale: string }> };

export function generateMetadata({ params }: Props) {
  return generateHubMetadata({ slug: "3d-modelleme-kktc", params });
}

export default function Page({ params }: Props) {
  return <SeoHubPage slug="3d-modelleme-kktc" params={params} />;
}
