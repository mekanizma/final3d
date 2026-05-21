import type { Product } from "@/types";

export function getProductGallery(product: Product): string[] {
  const list = product.images?.filter((u) => u.trim()) ?? [];
  if (list.length > 0) return list;
  return product.image?.trim() ? [product.image] : [];
}
