import { SeoHubPage, generateHubMetadata } from "@/components/seo/SeoHubPage";

type Props = { params: Promise<{ locale: string }> };

export function generateMetadata({ params }: Props) {
  return generateHubMetadata({ slug: "prototip-uretim-kibris", params });
}

export default function Page({ params }: Props) {
  return <SeoHubPage slug="prototip-uretim-kibris" params={params} />;
}
