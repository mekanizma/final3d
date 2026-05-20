import { create } from "zustand";
import { api } from "@/services";
import type { CreateProductInput, Product, UpdateProductInput } from "@/types";

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  createProduct: (input: CreateProductInput) => Promise<Product>;
  updateProduct: (id: string, input: UpdateProductInput) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await api.getProducts();
      set({ products, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  createProduct: async (input) => {
    const product = await api.createProduct(input);
    set({ products: [product, ...get().products] });
    return product;
  },

  updateProduct: async (id, input) => {
    const updated = await api.updateProduct(id, input);
    set({
      products: get().products.map((p) => (p.id === id ? updated : p)),
    });
  },

  deleteProduct: async (id) => {
    await api.deleteProduct(id);
    set({ products: get().products.filter((p) => p.id !== id) });
  },
}));
