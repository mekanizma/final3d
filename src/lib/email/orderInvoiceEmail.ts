import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { resolveOrderTotals } from "@/lib/pricing";
import { formatDate, formatPrice } from "@/lib/utils";
import { escapeHtml } from "@/lib/email/escapeHtml";
import { SITE_HOST, SITE_LOGO_PATH } from "@/lib/seo/constants";
import type { Order } from "@/types";

const BRAND = {
  name: "Final3d",
  tagline: "3D Baskı & Özel Üretim",
  supportEmail: "destek@final3d.kktc",
  web: "final3d.kktc",
} as const;

export interface OrderInvoiceEmailContent {
  subject: string;
  html: string;
  text: string;
}

export function buildOrderInvoiceEmail(order: Order): OrderInvoiceEmailContent {
  const totals = resolveOrderTotals(order);
  const subject = `Sipariş Onayı · ${order.id} · ${formatPrice(totals.total)}`;

  const itemRowsHtml = order.items
    .map((item) => {
      const lineTotal = item.price * item.quantity;
      return `
        <tr>
          <td style="padding:12px 8px;border-bottom:1px solid #2a1f4a;color:#e8e0ff;">${escapeHtml(item.productName)}</td>
          <td style="padding:12px 8px;border-bottom:1px solid #2a1f4a;text-align:center;color:#c4b5fd;">${item.quantity}</td>
          <td style="padding:12px 8px;border-bottom:1px solid #2a1f4a;text-align:right;color:#c4b5fd;">${formatPrice(item.price)}</td>
          <td style="padding:12px 8px;border-bottom:1px solid #2a1f4a;text-align:right;font-weight:600;color:#f0abfc;">${formatPrice(lineTotal)}</td>
        </tr>`;
    })
    .join("");

  const itemRowsText = order.items
    .map(
      (item) =>
        `  - ${item.productName} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`
    )
    .join("\n");

  const shippingLabel = totals.freeShipping
    ? "Ücretsiz"
    : formatPrice(totals.shippingFee);

  const html = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#0f0820;font-family:Segoe UI,system-ui,sans-serif;color:#f8f4ff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(165deg,#1a0b3e,#12082a);padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:620px;background:#1a1035;border:1px solid rgba(232,121,249,0.35);border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(168,85,247,0.2);">
          <tr>
            <td style="padding:28px 32px;background:linear-gradient(135deg,#7c3aed,#db2777,#0891b2);">
              <img src="${SITE_HOST}${SITE_LOGO_PATH}" alt="FINAL3D" width="120" height="120" style="display:block;height:44px;width:auto;margin-bottom:12px;" />
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.85);">Sipariş Onay Belgesi</p>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.9);">${BRAND.tagline}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#ddd6fe;">
                Merhaba <strong style="color:#f0abfc;">${escapeHtml(order.customerName)}</strong>,<br/>
                Siparişiniz başarıyla alındı. Aşağıda sipariş ve ödeme detaylarınızı bulabilirsiniz.
              </p>

              <table role="presentation" width="100%" style="margin-bottom:24px;background:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
                <tr>
                  <td style="padding:16px 20px;width:50%;vertical-align:top;">
                    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#a78bfa;">Sipariş Bilgisi</p>
                    <p style="margin:0 0 4px;font-size:13px;color:#e9d5ff;"><strong>No:</strong> ${escapeHtml(order.id)}</p>
                    <p style="margin:0 0 4px;font-size:13px;color:#e9d5ff;"><strong>Tarih:</strong> ${escapeHtml(formatDate(order.createdAt))}</p>
                    <p style="margin:0;font-size:13px;color:#e9d5ff;"><strong>Durum:</strong> ${escapeHtml(ORDER_STATUS_LABELS[order.status])}</p>
                  </td>
                  <td style="padding:16px 20px;width:50%;vertical-align:top;border-left:1px solid rgba(255,255,255,0.08);">
                    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#a78bfa;">Teslimat</p>
                    <p style="margin:0 0 4px;font-size:13px;color:#e9d5ff;">${escapeHtml(order.customerName)}</p>
                    <p style="margin:0 0 4px;font-size:13px;color:#c4b5fd;">${escapeHtml(order.phone)}</p>
                    <p style="margin:0;font-size:13px;color:#c4b5fd;line-height:1.5;">${escapeHtml(order.address)}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#a78bfa;">Ürün Kalemleri</p>
              <table role="presentation" width="100%" cellspacing="0" style="margin-bottom:20px;font-size:13px;">
                <thead>
                  <tr style="background:rgba(168,85,247,0.15);">
                    <th align="left" style="padding:10px 8px;color:#e9d5ff;font-weight:600;">Ürün</th>
                    <th align="center" style="padding:10px 8px;color:#e9d5ff;font-weight:600;">Adet</th>
                    <th align="right" style="padding:10px 8px;color:#e9d5ff;font-weight:600;">Birim</th>
                    <th align="right" style="padding:10px 8px;color:#e9d5ff;font-weight:600;">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRowsHtml}
                </tbody>
              </table>

              ${
                order.note
                  ? `<p style="margin:0 0 20px;padding:12px 16px;background:rgba(34,211,238,0.08);border-radius:10px;border:1px solid rgba(34,211,238,0.25);font-size:13px;color:#a5f3fc;"><strong>Sipariş notu:</strong> ${escapeHtml(order.note)}</p>`
                  : ""
              }

              <table role="presentation" width="100%" style="margin-bottom:24px;font-size:14px;">
                <tr>
                  <td style="padding:8px 0;color:#c4b5fd;">Ara Toplam</td>
                  <td align="right" style="padding:8px 0;color:#f8f4ff;">${formatPrice(totals.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#c4b5fd;">Kargo</td>
                  <td align="right" style="padding:8px 0;color:#f8f4ff;">${shippingLabel}</td>
                </tr>
                <tr>
                  <td style="padding:14px 0 0;font-size:16px;font-weight:700;color:#f0abfc;border-top:2px solid rgba(232,121,249,0.4);">Genel Toplam</td>
                  <td align="right" style="padding:14px 0 0;font-size:18px;font-weight:700;color:#22d3ee;border-top:2px solid rgba(232,121,249,0.4);">${formatPrice(totals.total)}</td>
                </tr>
              </table>

              <table role="presentation" width="100%" style="background:rgba(251,191,36,0.08);border-radius:10px;border:1px solid rgba(251,191,36,0.3);">
                <tr>
                  <td style="padding:14px 18px;font-size:13px;color:#fde68a;">
                    <strong>Ödeme yöntemi:</strong> Kapıda ödeme — Teslimat sırasında ${formatPrice(totals.total)} tahsil edilir.
                  </td>
                </tr>
              </table>

              ${
                order.userEmail
                  ? `<p style="margin:16px 0 0;font-size:12px;color:#a78bfa;">Hesap e-postası: ${escapeHtml(order.userEmail)}</p>`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background:rgba(0,0,0,0.25);border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0 0 8px;font-size:11px;line-height:1.5;color:#8b7cb8;">
                Bu e-posta sipariş onay ve bilgilendirme belgesidir. Resmi e-Fatura / e-Arşiv fatura yerine geçmez; yasal faturanız teslimat veya ödeme sonrası ayrıca düzenlenecektir.
              </p>
              <p style="margin:0;font-size:11px;color:#6b5b95;">
                ${BRAND.name} · ${BRAND.supportEmail} · ${BRAND.web}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  const text = `
${BRAND.name} — Sipariş Onayı

Merhaba ${order.customerName},

Siparişiniz alındı.

Sipariş No: ${order.id}
Tarih: ${formatDate(order.createdAt)}
Durum: ${ORDER_STATUS_LABELS[order.status]}

--- Teslimat ---
${order.customerName}
${order.phone}
${order.address}

--- Ürünler ---
${itemRowsText}

Ara Toplam: ${formatPrice(totals.subtotal)}
Kargo: ${shippingLabel}
GENEL TOPLAM: ${formatPrice(totals.total)}

Ödeme: Kapıda ödeme
${order.note ? `Not: ${order.note}` : ""}

---
Bu belge bilgilendirme amaçlıdır; resmi e-Fatura yerine geçmez.
${BRAND.name} · ${BRAND.supportEmail}
`.trim();

  return { subject, html, text };
}

