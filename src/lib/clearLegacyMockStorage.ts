import { isLegacyDemoProduct } from "@/lib/legacyDemoData";

/** Eski localStorage mock verisi (print3d_*) — bir kez temizlenir */
const LEGACY_KEYS = [
  "print3d_products",
  "print3d_orders",
  "print3d_users",
  "print3d_session",
  "print3d_custom_print_requests",
  "print3d_scan_quote_requests",
] as const;

const FLAG = "print3d_legacy_storage_cleared_v2";

function purgeLegacyCartItems(): void {
  const raw = localStorage.getItem("print3d_cart");
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as {
      state?: { items?: { product: { id: string } }[] };
    };
    const items = parsed.state?.items;
    if (!items?.length) return;
    const next = items.filter((i) => !isLegacyDemoProduct(i.product.id));
    if (next.length === items.length) return;
    parsed.state = { ...parsed.state, items: next };
    localStorage.setItem("print3d_cart", JSON.stringify(parsed));
  } catch {
    localStorage.removeItem("print3d_cart");
  }
}

export function clearLegacyMockStorageOnce(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(FLAG)) return;
  for (const key of LEGACY_KEYS) {
    localStorage.removeItem(key);
  }
  purgeLegacyCartItems();
  localStorage.setItem(FLAG, "1");
}

/** Sepette kalan demo ürünleri her mağaza ziyaretinde temizler */
export function purgeLegacyCartEachVisit(): void {
  if (typeof window === "undefined") return;
  purgeLegacyCartItems();
}
