import { defaultLocale, locales, type Locale } from "@/i18n/config";
import type { Product, ProductTranslations } from "@/types";

/** Eski kayıtlar için: name/description → tüm dillere kopyala */
export function translationsFromLegacy(
  name: string,
  description: string
): ProductTranslations {
  const entry = { name, description };
  return Object.fromEntries(
    locales.map((loc) => [loc, { ...entry }])
  ) as ProductTranslations;
}

export function normalizeProduct(product: Product): Product {
  if (product.translations) {
    return {
      ...product,
      name: product.translations[defaultLocale]?.name ?? product.name,
      description:
        product.translations[defaultLocale]?.description ?? product.description,
    };
  }
  const translations = translationsFromLegacy(product.name, product.description);
  return { ...product, translations };
}

export function getProductName(product: Product, locale: Locale): string {
  return (
    product.translations?.[locale]?.name ??
    product.translations?.[defaultLocale]?.name ??
    product.name
  );
}

export function getProductDescription(
  product: Product,
  locale: Locale
): string {
  return (
    product.translations?.[locale]?.description ??
    product.translations?.[defaultLocale]?.description ??
    product.description
  );
}

/** Arama: tüm dil metinlerinde eşleşme */
export function productSearchHaystack(product: Product): string {
  if (!product.translations) {
    return `${product.name} ${product.description}`.toLowerCase();
  }
  return locales
    .map((loc) => {
      const entry = product.translations?.[loc];
      if (!entry) return "";
      return `${entry.name} ${entry.description}`;
    })
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
