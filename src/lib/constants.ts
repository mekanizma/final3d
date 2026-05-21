import type { OrderStatus, ProductCategory } from "@/types";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  model: "MODEL",
  figure: "FİGÜR",
  accessory: "AKSESUAR",
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

export type RequestStatus = "yeni" | "inceleniyor" | "teklif-gonderildi";

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  yeni: "Yeni",
  inceleniyor: "İnceleniyor",
  "teklif-gonderildi": "Teklif Gönderildi",
};

export const REQUEST_STATUS_COLORS: Record<RequestStatus, string> = {
  yeni: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  inceleniyor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "teklif-gonderildi": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export const CURRENCY = "₺";
