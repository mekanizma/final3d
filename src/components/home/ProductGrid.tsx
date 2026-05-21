"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import {
  ProductCardsGrid,
  ProductCardSkeleton,
} from "@/components/products/ProductCardsGrid";
import { useProductStore } from "@/store/productStore";
import { PRODUCT_CATEGORIES, type ProductCategory } from "@/types";
import { categoryLabel } from "@/lib/order-labels";
import { useIntl } from "@/components/i18n/IntlProvider";

const categories: (ProductCategory | "all")[] = ["all", ...PRODUCT_CATEGORIES];

interface ProductGridProps {
  /** Tam sayfa katalog (/urunler) */
  standalone?: boolean;
}

export function ProductGrid({ standalone = false }: ProductGridProps) {
  const { t } = useIntl();
  const { products, loading, fetchProducts } = useProductStore();
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">(
    "all"
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section
      className={`relative z-10 ${standalone ? "pt-24 pb-24 min-h-screen" : "py-24"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ürün <span className="text-neon">Kataloğu</span>
          </h2>
          <p className="text-violet-200/60 max-w-xl mx-auto">
            MODEL, FİGÜR ve AKSESUAR kategorilerinde ürünler.
          </p>
        </motion.div>

        <div className="section-glow max-w-md mx-auto mb-10" />

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 text-white shadow-lg shadow-fuchsia-500/30"
                  : "glass text-violet-200/70 hover:text-white hover:border-cyan-400/40"
              }`}
            >
              {cat === "all" ? "Tümü" : categoryLabel(cat, t)}
            </button>
          ))}
        </div>

        {loading ? (
          <ProductCardsGrid columnMaxCount={4}>
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </ProductCardsGrid>
        ) : (
          <ProductCardsGrid columnMaxCount={4}>
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </ProductCardsGrid>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-slate-500 py-12">
            Bu kategoride ürün bulunamadı.
          </p>
        )}
      </div>
    </section>
  );
}
