import type { Order, UserPublic } from "@/types";

/** Sipariş kaydının oturumdaki kullanıcıya ait olup olmadığını kontrol eder */
export function orderBelongsToUser(order: Order, user: UserPublic): boolean {
  if (order.userId && order.userId === user.id) return true;
  const orderEmail = order.userEmail?.trim().toLowerCase();
  const userEmail = user.email.trim().toLowerCase();
  if (orderEmail && orderEmail === userEmail) return true;
  return false;
}
