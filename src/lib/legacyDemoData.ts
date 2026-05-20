/** Eski schema.sql seed kayıtları — mağaza ve admin listelerinden gizlenir */
export const LEGACY_DEMO_PRODUCT_IDS = new Set([
  "prod-1",
  "prod-2",
  "prod-3",
  "prod-4",
  "prod-5",
  "prod-6",
  "prod-7",
  "prod-8",
]);

export const LEGACY_DEMO_ORDER_IDS = new Set(["ord-1", "ord-2", "ord-3"]);

export function isLegacyDemoProduct(id: string): boolean {
  return LEGACY_DEMO_PRODUCT_IDS.has(id);
}

export function isLegacyDemoOrder(id: string): boolean {
  return LEGACY_DEMO_ORDER_IDS.has(id);
}

export function withoutLegacyDemoProducts<T extends { id: string }>(
  items: T[]
): T[] {
  return items.filter((p) => !isLegacyDemoProduct(p.id));
}

export function withoutLegacyDemoOrders<T extends { id: string }>(
  items: T[]
): T[] {
  return items.filter((o) => !isLegacyDemoOrder(o.id));
}
