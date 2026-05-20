"use client";

import { useState } from "react";
import type { CreateProductInput, Product, ProductCategory } from "@/types";
import { NeonButton } from "@/components/ui/NeonButton";
import { ProductImagePicker } from "@/components/admin/ProductImagePicker";
import { CategoryPicker } from "@/components/admin/CategoryPicker";

interface ProductFormProps {
  initial?: Product;
  onSubmit: (data: CreateProductInput) => Promise<void>;
  onCancel: () => void;
}

const empty: CreateProductInput = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  image: "",
  category: "3d-print",
  featured: false,
};

export function ProductForm({ initial, onSubmit, onCancel }: ProductFormProps) {
  const [form, setForm] = useState<CreateProductInput>(
    initial
      ? {
          name: initial.name,
          description: initial.description,
          price: initial.price,
          stock: initial.stock,
          image: initial.image,
          category: initial.category,
          featured: initial.featured,
        }
      : empty
  );
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const isNew = !initial;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.image.trim()) {
      setImageError("Lütfen bir ürün görseli seçin.");
      return;
    }
    setImageError(null);
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-violet-300/60 rounded-lg border border-cyan-400/20 bg-cyan-500/5 px-3 py-2 leading-relaxed">
        Türkçe ad ve açıklama girin; kayıtta otomatik olarak İngilizce, Rusça ve
        Arapça çeviriler oluşturulur.
      </p>
      <input
        className="input-field"
        placeholder="Ürün adı (Türkçe)"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <textarea
        className="input-field min-h-[100px] resize-none"
        placeholder="Açıklama (Türkçe)"
        required
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          className="input-field"
          type="number"
          placeholder="Fiyat (₺)"
          required
          min={0}
          value={form.price || ""}
          onChange={(e) =>
            setForm({ ...form, price: Number(e.target.value) })
          }
        />
        <input
          className="input-field"
          type="number"
          placeholder="Stok"
          required
          min={0}
          value={form.stock || ""}
          onChange={(e) =>
            setForm({ ...form, stock: Number(e.target.value) })
          }
        />
      </div>

      <ProductImagePicker
        value={form.image}
        onChange={(image) => {
          setForm({ ...form, image });
          setImageError(null);
        }}
      />
      {imageError && (
        <p className="text-xs text-rose-400 -mt-2">{imageError}</p>
      )}

      <CategoryPicker
        value={form.category}
        onChange={(category) => setForm({ ...form, category })}
      />
      <label className="flex items-center gap-2 text-sm text-violet-200/60 cursor-pointer">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          className="rounded"
        />
        Öne çıkan ürün
      </label>
      <div className="flex gap-3 pt-2">
        <NeonButton type="submit" disabled={loading}>
          {loading
            ? isNew
              ? "Çeviriler oluşturuluyor…"
              : "Kaydediliyor…"
            : initial
              ? "Güncelle"
              : "Ekle"}
        </NeonButton>
        <NeonButton type="button" variant="ghost" onClick={onCancel}>
          İptal
        </NeonButton>
      </div>
    </form>
  );
}
