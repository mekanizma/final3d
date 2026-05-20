import type { Order } from "@/types";

export interface OrderEmailResponse {
  sent: boolean;
  mock?: boolean;
  messageId?: string;
  error?: string;
}

/** Sipariş onay e-postasını API üzerinden gönderir */
export async function requestOrderConfirmationEmail(
  order: Order
): Promise<OrderEmailResponse> {
  const res = await fetch("/api/orders/send-confirmation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order }),
  });

  const data = (await res.json()) as OrderEmailResponse;

  if (!res.ok && !data.mock) {
    throw new Error(data.error ?? "E-posta gönderilemedi");
  }

  return data;
}
