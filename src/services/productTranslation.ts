import type { ProductTranslations } from "@/types";
import { generateProductTranslations } from "@/lib/generateProductTranslations";

export interface TranslateProductPayload {
  name: string;
  description: string;
}

export async function buildProductTranslations(
  name: string,
  description: string
): Promise<ProductTranslations> {
  return generateProductTranslations(name, description);
}
