import type { OrderStatus, ProductCategory } from "@/types";

export const STORAGE_KEYS = {
  products: "print3d_products",
  orders: "print3d_orders",
  users: "print3d_users",
  session: "print3d_session",
  customPrintRequests: "print3d_custom_print_requests",
  scanQuoteRequests: "print3d_scan_quote_requests",
} as const;

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  "3d-print": "3D Yazıcı",
  model: "Model & Figür",
  accessory: "Aksesuar",
  filament: "Filament",
  tool: "Alet & Kalibrasyon",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  yeni: "Yeni",
  hazirlaniyor: "Hazırlanıyor",
  kargoda: "Kargoda",
  "teslim-edildi": "Teslim Edildi",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  yeni: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  hazirlaniyor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  kargoda: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "teslim-edildi": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export const CURRENCY = "₺";
