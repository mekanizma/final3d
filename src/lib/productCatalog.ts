import type { Product, ProductCategory } from "@/types";
import { productSearchHaystack } from "@/lib/product-i18n";

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name"
  | "newest";

export const SORT_LABELS: Record<SortOption, string> = {
  featured: "Öne çıkanlar",
  "price-asc": "Fiyat: Düşük → Yüksek",
  "price-desc": "Fiyat: Yüksek → Düşük",
  name: "İsim (A–Z)",
  newest: "En yeni",
};

export interface ProductFilters {
  search: string;
  category: ProductCategory | "all";
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  featuredOnly: boolean;
  sort: SortOption;
}

export const DEFAULT_FILTERS: ProductFilters = {
  search: "",
  category: "all",
  minPrice: 0,
  maxPrice: Infinity,
  inStockOnly: false,
  featuredOnly: false,
  sort: "featured",
};

export function getProductPriceBounds(products: Product[]): {
  min: number;
  max: number;
} {
  if (products.length === 0) return { min: 0, max: 20000 };
  const prices = products.map((p) => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

export function filterAndSortProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  const q = filters.search.trim().toLowerCase();

  let result = products.filter((p) => {
    if (filters.category !== "all" && p.category !== filters.category) {
      return false;
    }
    if (filters.inStockOnly && p.stock <= 0) return false;
    if (filters.featuredOnly && !p.featured) return false;
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
    if (q && !productSearchHaystack(p).includes(q)) return false;
    return true;
  });

  result = [...result].sort((a, b) => {
    switch (filters.sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name, "tr");
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "featured":
      default: {
        const fa = a.featured ? 1 : 0;
        const fb = b.featured ? 1 : 0;
        if (fb !== fa) return fb - fa;
        return a.name.localeCompare(b.name, "tr");
      }
    }
  });

  return result;
}

export function countActiveFilters(filters: ProductFilters): number {
  let n = 0;
  if (filters.search.trim()) n++;
  if (filters.category !== "all") n++;
  if (filters.inStockOnly) n++;
  if (filters.featuredOnly) n++;
  if (filters.sort !== "featured") n++;
  if (filters.minPrice > 0 || filters.maxPrice < Infinity) n++;
  return n;
}
