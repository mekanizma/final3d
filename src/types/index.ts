import type { Locale } from "@/i18n/config";

export type ProductCategory =
  | "3d-print"
  | "model"
  | "accessory"
  | "filament"
  | "tool";

export type OrderStatus =
  | "yeni"
  | "hazirlaniyor"
  | "kargoda"
  | "teslim-edildi";

export type ProductLocaleFields = {
  name: string;
  description: string;
};

export type ProductTranslations = Record<Locale, ProductLocaleFields>;

export interface Product {
  id: string;
  /** Varsayılan (TR) — sipariş anlık görüntüsü ve geriye dönük uyumluluk */
  name: string;
  description: string;
  /** Mağaza arayüzünde locale’e göre gösterilir */
  translations?: ProductTranslations;
  price: number;
  stock: number;
  image: string;
  category: ProductCategory;
  featured?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  passwordHash: string;
  createdAt: string;
}

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  address?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  note?: string;
  paymentMethod: "kapida-odeme";
  status: OrderStatus;
  subtotal?: number;
  shippingFee?: number;
  total: number;
  createdAt: string;
  userId?: string;
  userEmail?: string;
}

export interface CreateOrderInput {
  customerName: string;
  phone: string;
  address: string;
  items: { productId: string; quantity: number }[];
  note?: string;
  userId?: string;
  userEmail?: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: ProductCategory;
  featured?: boolean;
}

export type UpdateProductInput = Partial<CreateProductInput>;
