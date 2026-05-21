"use client";

import { useEffect, useMemo, useState } from "react";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useIntl } from "@/components/i18n/IntlProvider";
import { getProductName } from "@/lib/product-i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Package } from "lucide-react";
import { ProductPhoto } from "@/components/ui/ProductPhoto";
import { useProductStore } from "@/store/productStore";
import {
  DEFAULT_FILTERS,
  filterAndSortProducts,
} from "@/lib/productCatalog";
import type { Product } from "@/types";

const SLOT_COUNT = 4;
const ROTATE_MS = 60_000;

function getSlotProducts(products: Product[], startIndex: number): Product[] {
  if (products.length === 0) return [];
  return Array.from({ length: SLOT_COUNT }, (_, i) =>
    products[(startIndex + i) % products.length]
  );
}

export function ProductShowcaseRotator() {
  const { locale } = useIntl();
  const { products, loading, fetchProducts } = useProductStore();
  const [batchStart, setBatchStart] = useState(0);

  const catalog = useMemo(
    () => filterAndSortProducts(products, DEFAULT_FILTERS),
    [products]
  );

  const step = catalog.length > SLOT_COUNT ? SLOT_COUNT : 1;

  const visible = useMemo(
    () => getSlotProducts(catalog, batchStart),
    [catalog, batchStart]
  );

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, [fetchProducts, products.length]);

  useEffect(() => {
    if (catalog.length <= 1) return;
    const id = window.setInterval(() => {
      setBatchStart((s) => (s + step) % catalog.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [catalog.length, step]);

  if (loading && catalog.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-[260px] sm:max-w-xs">
        {Array.from({ length: SLOT_COUNT }).map((_, i) => (
          <motion.div
            key={i}
            className="aspect-square rounded-2xl glass border border-white/10 animate-pulse bg-white/5"
          />
        ))}
      </div>
    );
  }

  if (catalog.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-[260px] sm:max-w-xs">
        {Array.from({ length: SLOT_COUNT }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl glass border border-white/10 flex items-center justify-center"
          >
            <Package className="w-8 h-8 text-cyan-300/50" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={batchStart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-[260px] sm:max-w-xs"
      >
        {visible.map((product) => {
          const name = getProductName(product, locale);
          return (
          <LocaleLink
            key={product.id}
            href={`/products/${product.id}`}
            className="group relative aspect-square rounded-2xl glass border border-white/10 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
            aria-label={name}
          >
            <ProductPhoto
              src={product.image}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12082a]/85 via-[#12082a]/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
            <p className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2 text-[9px] sm:text-xs font-medium text-white/95 line-clamp-2 leading-tight">
              {name}
            </p>
          </LocaleLink>
        );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
