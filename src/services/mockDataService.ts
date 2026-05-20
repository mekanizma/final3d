import { initialProducts } from "@/data/products";
import { initialOrders } from "@/data/orders";
import { STORAGE_KEYS } from "@/lib/constants";
import { generateId } from "@/lib/utils";
import { calculateOrderTotals } from "@/lib/pricing";
import { normalizeProduct } from "@/lib/product-i18n";
import { buildProductTranslations } from "@/services/productTranslation";
import type {
  CreateOrderInput,
  CreateProductInput,
  Order,
  OrderStatus,
  Product,
  UpdateProductInput,
} from "@/types";

function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

/** Mock data service – swap with supabaseService later */
export const mockDataService = {
  // ─── Products ───────────────────────────────────────────
  async getProducts(): Promise<Product[]> {
    const raw = readFromStorage(
      STORAGE_KEYS.products,
      initialProducts as Product[]
    );
    return raw.map(normalizeProduct);
  },

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.id === id) ?? null;
  },

  async createProduct(input: CreateProductInput): Promise<Product> {
    const products = await this.getProducts();
    const translations = await buildProductTranslations(
      input.name,
      input.description
    );
    const product: Product = normalizeProduct({
      ...input,
      translations,
      id: generateId("prod"),
      createdAt: new Date().toISOString(),
    });
    const updated = [product, ...products];
    writeToStorage(STORAGE_KEYS.products, updated);
    return product;
  },

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Ürün bulunamadı");
    const existing = products[index];
    const name = input.name ?? existing.name;
    const description = input.description ?? existing.description;
    const textChanged =
      (input.name !== undefined && input.name !== existing.name) ||
      (input.description !== undefined &&
        input.description !== existing.description);

    let translations = existing.translations;
    if (textChanged) {
      translations = await buildProductTranslations(name, description);
    }

    const merged = normalizeProduct({
      ...existing,
      ...input,
      name,
      description,
      translations,
    });
    products[index] = merged;
    writeToStorage(STORAGE_KEYS.products, products);
    return merged;
  },

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    writeToStorage(STORAGE_KEYS.products, filtered);
  },

  // ─── Orders ─────────────────────────────────────────────
  async getOrders(): Promise<Order[]> {
    const orders = readFromStorage(STORAGE_KEYS.orders, initialOrders as Order[]);
    return orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getOrderById(id: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find((o) => o.id === id) ?? null;
  },

  async getOrdersByUserId(
    userId: string,
    userEmail?: string
  ): Promise<Order[]> {
    const orders = await this.getOrders();
    const email = userEmail?.trim().toLowerCase();
    return orders.filter((o) => {
      if (o.userId === userId) return true;
      if (email && o.userEmail?.trim().toLowerCase() === email) return true;
      return false;
    });
  },

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const products = await this.getProducts();
    const items = input.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Ürün bulunamadı: ${item.productId}`);
      const displayName =
        product.translations?.tr?.name ?? product.name;
      return {
        productId: product.id,
        productName: displayName,
        quantity: item.quantity,
        price: product.price,
      };
    });
    const subtotal = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const pricing = calculateOrderTotals(subtotal);
    const order: Order = {
      id: generateId("ord"),
      customerName: input.customerName,
      phone: input.phone,
      address: input.address,
      items,
      note: input.note,
      paymentMethod: "kapida-odeme",
      status: "yeni",
      subtotal: pricing.subtotal,
      shippingFee: pricing.shippingFee,
      total: pricing.total,
      createdAt: new Date().toISOString(),
      userId: input.userId,
      userEmail: input.userEmail,
    };
    const orders = await this.getOrders();
    const updated = [order, ...orders];
    writeToStorage(STORAGE_KEYS.orders, updated);
    return order;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const orders = await this.getOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error("Sipariş bulunamadı");
    orders[index] = { ...orders[index], status };
    writeToStorage(STORAGE_KEYS.orders, orders);
    return orders[index];
  },

  async deleteOrder(id: string): Promise<void> {
    const orders = await this.getOrders();
    const filtered = orders.filter((o) => o.id !== id);
    writeToStorage(STORAGE_KEYS.orders, filtered);
  },

  /** Reset to seed data */
  async resetData(): Promise<void> {
    writeToStorage(STORAGE_KEYS.products, initialProducts);
    writeToStorage(STORAGE_KEYS.orders, initialOrders);
  },
};
