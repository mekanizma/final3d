import { Resend } from "resend";
import { buildOrderInvoiceEmail } from "@/lib/email/orderInvoiceEmail";
import type { Order } from "@/types";

export interface SendOrderConfirmationResult {
  sent: boolean;
  mock?: boolean;
  messageId?: string;
  error?: string;
}

function getEmailConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    from:
      process.env.EMAIL_FROM ?? "Final3d <onboarding@resend.dev>",
    adminCopy: process.env.ADMIN_ORDER_EMAIL,
  };
}

function resolveRecipient(order: Order): string | null {
  return order.userEmail?.trim() || null;
}

export async function sendOrderConfirmationEmail(
  order: Order
): Promise<SendOrderConfirmationResult> {
  const recipient = resolveRecipient(order);
  if (!recipient) {
    return { sent: false, error: "Alıcı e-posta adresi bulunamadı." };
  }

  const { subject, html, text } = buildOrderInvoiceEmail(order);
  const { apiKey, from, adminCopy } = getEmailConfig();

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info(
        "[email:mock] RESEND_API_KEY tanımlı değil — sipariş onay e-postası simüle edildi:",
        { to: recipient, subject, orderId: order.id }
      );
    }
    return { sent: false, mock: true };
  }

  const resend = new Resend(apiKey);
  const toAddresses = [recipient];
  if (adminCopy && adminCopy !== recipient) {
    toAddresses.push(adminCopy);
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: toAddresses,
      subject,
      html,
      text,
      replyTo: process.env.EMAIL_REPLY_TO ?? undefined,
    });

    if (error) {
      console.error("[email] Resend hatası:", error);
      return { sent: false, error: error.message };
    }

    return { sent: true, messageId: data?.id };
  } catch (e) {
    const message = e instanceof Error ? e.message : "E-posta gönderilemedi";
    console.error("[email]", message);
    return { sent: false, error: message };
  }
}

