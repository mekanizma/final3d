"use client";

import { useEffect, useState } from "react";
import { ProductPhoto } from "@/components/ui/ProductPhoto";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useProductStore } from "@/store/productStore";
import { ProductForm } from "@/components/admin/ProductForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { productSearchHaystack } from "@/lib/product-i18n";
import { locales, localeLabels } from "@/i18n/config";

export default function AdminProductsPage() {
  const { products, fetchProducts, createProduct, updateProduct, deleteProduct } =
    useProductStore();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const q = search.trim().toLowerCase();
  const filtered = products.filter((p) =>
    q ? productSearchHaystack(p).includes(q) : true
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Ürün Yönetimi</h1>
          <p className="text-violet-200/60 text-sm">{products.length} ürün</p>
        </div>
        <NeonButton
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Ürün Ekle
        </NeonButton>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <GlassCard hover={false} className="p-6">
              <h2 className="font-semibold mb-4">
                {editing ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
              </h2>
              <ProductForm
                initial={editing ?? undefined}
                onSubmit={async (data) => {
                  if (editing) {
                    await updateProduct(editing.id, data);
                  } else {
                    await createProduct(data);
                  }
                  setShowForm(false);
                  setEditing(null);
                }}
                onCancel={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
              />
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-300/70 pointer-events-none"
          strokeWidth={2}
          aria-hidden
        />
        <input
          className="input-field pl-10"
          placeholder="Ürün ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <GlassCard hover={false} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <ProductPhoto
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-xs text-violet-200/60">
                      {CATEGORY_LABELS[product.category]} · Stok: {product.stock}
                    </p>
                    {product.translations && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {locales.map((loc) => (
                          <span
                            key={loc}
                            className="text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/25 bg-emerald-500/10 text-emerald-300/90"
                            title={product.translations![loc].name}
                          >
                            {localeLabels[loc]}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-bold text-neon hidden sm:block">
                    {formatPrice(product.price)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(product);
                        setShowForm(true);
                      }}
                      className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-400"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Bu ürünü silmek istediğinize emin misiniz?"))
                          deleteProduct(product.id);
                      }}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
