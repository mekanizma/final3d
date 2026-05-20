import type { OrderStatus } from "@/types";

export function orderStatusLabel(
  status: OrderStatus,
  t: (key: string) => string
): string {
  return t(`orderStatus.${status}`);
}

export function categoryLabel(
  category: string,
  t: (key: string) => string
): string {
  const key = `category.${category}`;
  const v = t(key);
  return v === key ? category : v;
}
