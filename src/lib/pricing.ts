/** 1500 ₺ ve üzeri siparişlerde kargo ücretsiz */
export const FREE_SHIPPING_THRESHOLD = 1500;

/** Standart kargo ücreti (KKTC) */
export const STANDARD_SHIPPING_FEE = 99;

export interface OrderTotals {
  subtotal: number;
  shippingFee: number;
  total: number;
  freeShipping: boolean;
  amountUntilFreeShipping: number;
}

function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/** Genel toplam = ara toplam + kargo */
export function calculateOrderTotals(subtotal: number): OrderTotals {
  const safeSubtotal = Math.max(0, subtotal);
  const freeShipping = safeSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = freeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const total = roundMoney(safeSubtotal + shippingFee);
  const amountUntilFreeShipping = freeShipping
    ? 0
    : roundMoney(FREE_SHIPPING_THRESHOLD - safeSubtotal);

  return {
    subtotal: roundMoney(safeSubtotal),
    shippingFee,
    total,
    freeShipping,
    amountUntilFreeShipping,
  };
}

export function getSubtotalFromItems(
  items: { price: number; quantity: number }[]
): number {
  return roundMoney(
    items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );
}

export function resolveOrderTotals(order: {
  items: { price: number; quantity: number }[];
  subtotal?: number;
  shippingFee?: number;
  total: number;
}): OrderTotals {
  const subtotal =
    order.subtotal ?? getSubtotalFromItems(order.items);
  return calculateOrderTotals(subtotal);
}
