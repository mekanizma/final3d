"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  Package,
  Boxes,
  Puzzle,
  Shapes,
  RotateCcw,
  LayoutGrid,
  TrendingUp,
} from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { SortSelect } from "@/components/products/SortSelect";
import { useIntl } from "@/components/i18n/IntlProvider";
import { useProductStore } from "@/store/productStore";
import { categoryLabel } from "@/lib/order-labels";
import { tFormat } from "@/lib/t-format";
import { formatPrice, cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { PRODUCT_CATEGORIES, type ProductCategory } from "@/types";
import {
  DEFAULT_FILTERS,
  countActiveFilters,
  filterAndSortProducts,
  getProductPriceBounds,
  type ProductFilters,
  type SortOption,
} from "@/lib/productCatalog";

const categories: (ProductCategory | "all")[] = ["all", ...PRODUCT_CATEGORIES];

const categoryIcons: Record<ProductCategory | "all", typeof Package> = {
  all: LayoutGrid,
  model: Boxes,
  figure: Shapes,
  accessory: Puzzle,
};

const PRICE_PRESET_KEYS = [
  { key: "products.allPrices", min: 0, max: Infinity },
  { key: "products.under500", min: 0, max: 500 },
  { key: "products.range500_2000", min: 500, max: 2000 },
  { key: "products.range2000_10000", min: 2000, max: 10000 },
  { key: "products.over10k", min: 10000, max: Infinity },
] as const;

function FiltersPanel({
  filters,
  setFilters,
  priceBounds,
  onClose,
  showClose,
  t,
}: {
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
  priceBounds: { min: number; max: number };
  onClose?: () => void;
  showClose?: boolean;
  t: (key: string) => string;
}) {
  const [localMax, setLocalMax] = useState(
    filters.maxPrice === Infinity ? priceBounds.max : filters.maxPrice
  );

  useEffect(() => {
    if (filters.maxPrice === Infinity) setLocalMax(priceBounds.max);
    else setLocalMax(filters.maxPrice);
  }, [filters.maxPrice, priceBounds.max]);

  function resetFilters() {
    setFilters({
      ...DEFAULT_FILTERS,
      maxPrice: Infinity,
    });
    setLocalMax(priceBounds.max);
  }

  return (
    <div className="space-y-6">
      {showClose && onClose && (
        <div className="flex items-center justify-between lg:hidden">
          <h3 className="font-semibold text-white">{t("products.filters")}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg glass-hover"
            aria-label={t("products.close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div>
        <p className="text-[11px] uppercase tracking-wider text-violet-300/50 mb-3 font-medium">
          {t("productsFilter.category")}
        </p>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat];
            const active = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  setFilters((f) => ({ ...f, category: cat }))
                }
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all border",
                  active
                    ? "bg-gradient-to-r from-fuchsia-500/25 to-cyan-500/15 border-fuchsia-400/40 text-white"
                    : "border-transparent text-violet-200/70 hover:bg-white/5 hover:border-white/10"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    active ? "text-cyan-300" : "text-violet-400/60"
                  )}
                />
                <span className="flex-1">
                  {cat === "all"
                    ? t("products.allCategories")
                    : categoryLabel(cat, t)}
                </span>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wider text-violet-300/50 mb-3 font-medium">
          {t("products.priceRange")}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {PRICE_PRESET_KEYS.map((preset) => {
            const active =
              filters.minPrice === preset.min &&
              filters.maxPrice === preset.max;
            return (
              <button
                key={preset.key}
                type="button"
                onClick={() => {
                  setFilters((f) => ({
                    ...f,
                    minPrice: preset.min,
                    maxPrice: preset.max,
                  }));
                  if (preset.max !== Infinity) setLocalMax(preset.max);
                  else setLocalMax(priceBounds.max);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs border transition-all",
                  active
                    ? "bg-fuchsia-500/20 border-fuchsia-400/50 text-white"
                    : "glass border-white/10 text-violet-200/60 hover:border-white/20"
                )}
              >
                {t(preset.key)}
              </button>
            );
          })}
        </div>
        <div className="space-y-3 px-1">
          <div className="flex justify-between text-xs text-violet-300/60">
            <span>{formatPrice(filters.minPrice)}</span>
            <span>
              {filters.maxPrice === Infinity
                ? `${formatPrice(priceBounds.max)}+`
                : formatPrice(filters.maxPrice)}
            </span>
          </div>
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            step={50}
            value={Math.min(localMax, priceBounds.max)}
            onChange={(e) => {
              const v = Number(e.target.value);
              setLocalMax(v);
              setFilters((f) => ({
                ...f,
                minPrice: priceBounds.min,
                maxPrice: v,
              }));
            }}
            className="w-full h-1.5 rounded-full appearance-none bg-violet-900/80 accent-cyan-400 cursor-pointer"
          />
        </div>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wider text-violet-300/50 mb-3 font-medium">
          {t("products.view")}
        </p>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  inStockOnly: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded border-violet-500/50 bg-violet-950/50 text-fuchsia-500 focus:ring-cyan-400/50"
            />
            <span className="text-sm text-violet-200/75 group-hover:text-white transition-colors">
              {t("products.inStockOnly")}
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.featuredOnly}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  featuredOnly: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded border-violet-500/50 bg-violet-950/50 text-fuchsia-500 focus:ring-cyan-400/50"
            />
            <span className="text-sm text-violet-200/75 group-hover:text-white transition-colors flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {t("products.featuredOnly")}
            </span>
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={resetFilters}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-violet-200/60 border border-white/10 hover:border-white/20 hover:text-white transition-all"
      >
        <RotateCcw className="w-4 h-4" />
        {t("products.resetFilters")}
      </button>
    </div>
  );
}

export function ProductsCatalog() {
  const { t } = useIntl();
  const { products, loading, fetchProducts } = useProductStore();
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput }));
    }, 280);
    return () => clearTimeout(t);
  }, [searchInput]);

  const priceBounds = useMemo(
    () => getProductPriceBounds(products),
    [products]
  );

  const filtered = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters]
  );

  const activeFilterCount = countActiveFilters(filters);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { all: products.length };
    for (const p of products) {
      map[p.category] = (map[p.category] ?? 0) + 1;
    }
    return map;
  }, [products]);

  return (
    <div className="relative min-h-screen pt-20 pb-24 overflow-hidden">
      {/* Hero */}
      <div className="relative border-b border-white/5">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        >
          <div className="absolute top-0 left-1/3 w-[280px] h-[120px] bg-fuchsia-600/12 blur-[70px] rounded-full" />
          <div className="absolute inset-0 grid-pattern opacity-15" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full badge-glow text-[11px] mb-2">
              <TrendingUp className="w-3 h-3 text-cyan-300" />
              {loading
                ? "…"
                : tFormat(t, "products.productCount", {
                    count: String(products.length),
                  })}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {t("products.catalogTitle")}{" "}
              <span className="bg-gradient-to-r from-fuchsia-300 via-violet-200 to-cyan-300 bg-clip-text text-transparent">
                {t("products.catalogTitleNeon")}
              </span>
            </h1>
            <p className="text-violet-200/50 text-sm mt-1 mb-4 max-w-lg">
              {t("products.catalogSub")}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 max-w-md">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400/50 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t("products.searchPh")}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl glass border border-white/10 bg-white/5 text-sm text-white placeholder:text-violet-300/40 focus:outline-none focus:border-cyan-400/45 transition-all"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10"
                    aria-label={t("products.clearSearch")}
                  >
                    <X className="w-4 h-4 text-violet-300/60" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass border border-fuchsia-400/30 text-sm font-medium shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {t("products.filters")}
                {activeFilterCount > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-cyan-500/30 text-cyan-200 text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        <div className="flex gap-8 lg:gap-10">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <GlassCard hover={false} className="p-5 border-white/10">
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/10">
                  <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-sm">
                    {t("products.filterLabel")}
                  </span>
                </div>
                <FiltersPanel
                  filters={filters}
                  setFilters={setFilters}
                  priceBounds={priceBounds}
                  t={t}
                />
              </GlassCard>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-sm text-violet-200/60">
                {loading ? (
                  t("products.loading")
                ) : (
                  <>
                    <span className="text-white font-medium">
                      {filtered.length}
                    </span>{" "}
                    {t("products.countListed")}
                    {filters.category !== "all" && (
                      <span className="text-violet-300/50">
                        {" "}
                        · {categoryLabel(filters.category, t)}
                      </span>
                    )}
                  </>
                )}
              </p>
              <SortSelect
                value={filters.sort}
                onChange={(sort) => setFilters((f) => ({ ...f, sort }))}
                className="w-full sm:w-auto shrink-0"
              />
            </div>

            {/* Category pills — horizontal scroll */}
            <div className="product-pill-scroll flex gap-2 overflow-x-auto pb-4 mb-6 -mx-1 px-1">
              {categories.map((cat) => {
                const Icon = categoryIcons[cat];
                const active = filters.category === cat;
                const count = categoryCounts[cat === "all" ? "all" : cat] ?? 0;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      setFilters((f) => ({ ...f, category: cat }))
                    }
                    className={cn(
                      "snap-start flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-all shrink-0",
                      active
                        ? "bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 text-white border-transparent shadow-lg shadow-fuchsia-500/25"
                        : "glass text-violet-200/70 border-white/10 hover:border-cyan-400/30"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat === "all" ? t("products.all") : categoryLabel(cat, t)}
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full",
                        active
                          ? "bg-white/20"
                          : "bg-white/5 text-violet-300/50"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active chips */}
            <AnimatePresence>
              {(activeFilterCount > 0 || searchInput) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 mb-6"
                >
                  {searchInput && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-cyan-500/15 border border-cyan-400/30 text-cyan-100">
                      {tFormat(t, "products.searchChip", { q: searchInput })}
                      <button
                        type="button"
                        onClick={() => setSearchInput("")}
                        className="hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.inStockOnly && (
                    <FilterChip
                      label={t("products.inStockChip")}
                      onRemove={() =>
                        setFilters((f) => ({ ...f, inStockOnly: false }))
                      }
                    />
                  )}
                  {filters.featuredOnly && (
                    <FilterChip
                      label={t("products.featured")}
                      onRemove={() =>
                        setFilters((f) => ({ ...f, featuredOnly: false }))
                      }
                    />
                  )}
                  {(filters.minPrice > 0 ||
                    filters.maxPrice < Infinity) && (
                    <FilterChip
                      label={`${formatPrice(filters.minPrice)} – ${
                        filters.maxPrice === Infinity
                          ? "∞"
                          : formatPrice(filters.maxPrice)
                      }`}
                      onRemove={() =>
                        setFilters((f) => ({
                          ...f,
                          minPrice: 0,
                          maxPrice: Infinity,
                        }))
                      }
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="glass rounded-2xl overflow-hidden animate-pulse"
                  >
                    <div className="h-56 bg-white/5" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-white/5 rounded w-full" />
                      <div className="h-8 bg-white/10 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, i) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.24) }}
                    >
                      <ProductCard product={product} index={i} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <EmptyCatalogState
                t={t}
                onReset={() => {
                  setSearchInput("");
                  setFilters({
                    ...DEFAULT_FILTERS,
                    maxPrice: Infinity,
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed bottom-0 left-0 right-0 z-[95] lg:hidden max-h-[85vh] overflow-y-auto rounded-t-3xl glass border-t border-fuchsia-400/20 p-6 pb-10"
            >
              <FiltersPanel
                filters={filters}
                setFilters={setFilters}
                priceBounds={priceBounds}
                showClose
                onClose={() => setMobileFiltersOpen(false)}
                t={t}
              />
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white font-medium text-sm"
              >
                {tFormat(t, "products.showCount", {
                  count: String(filtered.length),
                })}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-fuchsia-500/15 border border-fuchsia-400/25 text-violet-100">
      {label}
      <button type="button" onClick={onRemove} className="hover:text-white">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

function EmptyCatalogState({
  onReset,
  t,
}: {
  onReset: () => void;
  t: (key: string) => string;
}) {
  return (
    <GlassCard
      hover={false}
      className="py-16 px-8 text-center border-dashed border-white/15"
    >
      <Package className="w-14 h-14 text-violet-400/40 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">{t("products.noResultsTitle")}</h3>
      <p className="text-violet-200/55 text-sm max-w-sm mx-auto mb-6">
        {t("products.noResultsHint")}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-hover text-sm"
      >
        <RotateCcw className="w-4 h-4" />
        {t("products.showAll")}
      </button>
    </GlassCard>
  );
}
