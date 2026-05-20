import { JsonLd } from "@/components/seo/JsonLd";
import {
  localBusinessJsonLd,
  organizationJsonLd,
  webSiteJsonLd,
} from "@/lib/seo/json-ld";

export function GlobalJsonLd() {
  return (
    <JsonLd
      data={[organizationJsonLd(), localBusinessJsonLd(), webSiteJsonLd()]}
    />
  );
}
