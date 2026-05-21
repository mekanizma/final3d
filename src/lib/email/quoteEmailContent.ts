import { escapeHtml } from "@/lib/email/escapeHtml";
import { SITE_HOST, SITE_LOGO_PATH } from "@/lib/seo/constants";
import {
  materialLabelTr,
  scanLocationLabelTr,
  scanPurposeLabelTr,
  scanSurfaceLabelTr,
} from "@/lib/email/quoteLabels";
import { formatDate } from "@/lib/utils";
import type { CustomPrintRequest } from "@/services/customPrintService";
import type { ScanQuoteRequest } from "@/services/scanRequestService";

function emailShell(title: string, bodyHtml: string, bodyText: string) {
  const html = `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="utf-8" /><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#0f0820;font-family:Segoe UI,system-ui,sans-serif;color:#f8f4ff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(165deg,#1a0b3e,#12082a);padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:620px;background:#1a1035;border:1px solid rgba(232,121,249,0.35);border-radius:16px;overflow:hidden;">
        <tr>
          <td style="padding:24px 28px;background:linear-gradient(135deg,#7c3aed,#db2777,#0891b2);">
            <img src="${SITE_HOST}${SITE_LOGO_PATH}" alt="FINAL3D" width="120" height="120" style="display:block;height:40px;width:auto;margin-bottom:12px;" />
            <h1 style="margin:0;font-size:22px;color:#fff;">${escapeHtml(title)}</h1>
          </td>
        </tr>
        <tr><td style="padding:28px;">${bodyHtml}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  return { html, text: bodyText };
}

function row(label: string, value: string) {
  return `<p style="margin:0 0 10px;font-size:14px;color:#e9d5ff;"><strong style="color:#c4b5fd;">${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

function rowText(label: string, value: string) {
  return `${label}: ${value}`;
}

export function buildCustomPrintQuoteEmail(req: CustomPrintRequest) {
  const subject = `Özel baskı talebi · ${req.name} · ${req.id}`;
  const fileKb = Math.round(req.fileSize / 1024);
  const fields = [
    row("Talep no", req.id),
    row("Tarih", formatDate(req.createdAt)),
    row("Ad Soyad", req.name),
    row("E-posta", req.email),
    row("Telefon", req.phone),
    row("Malzeme", materialLabelTr(req.material)),
    row("Renk", req.color || "—"),
    row("Adet", req.quantity),
    row("Dosya", `${req.fileName} (${fileKb} KB)`),
    req.note ? row("Not", req.note) : "",
  ].join("");

  const text = [
    subject,
    "",
    rowText("Talep no", req.id),
    rowText("Ad", req.name),
    rowText("E-posta", req.email),
    rowText("Telefon", req.phone),
    rowText("Malzeme", materialLabelTr(req.material)),
    rowText("Renk", req.color),
    rowText("Adet", req.quantity),
    rowText("Dosya", `${req.fileName} (${fileKb} KB)`),
    req.note ? rowText("Not", req.note) : "",
  ]
    .filter(Boolean)
    .join("\n");

  const { html, text: plain } = emailShell(
    "Yeni özel baskı talebi",
    fields,
    text
  );
  return { subject, html, text: plain };
}

export function buildScanQuoteEmail(req: ScanQuoteRequest) {
  const subject = `3D tarama teklifi · ${req.name} · ${req.city} · ${req.id}`;
  const fields = [
    row("Talep no", req.id),
    row("Tarih", formatDate(req.createdAt)),
    row("Ad Soyad", req.name),
    row("E-posta", req.email),
    row("Telefon", req.phone),
    row("Şehir", req.city),
    row("Nesne", req.objectDescription),
    row("Tarama alanı", req.scanArea),
    row("Adet", req.quantity),
    row("Konum", scanLocationLabelTr(req.locationType)),
    row("Adres", req.locationAddress || "—"),
    row("Amaç", scanPurposeLabelTr(req.purpose)),
    row("Yüzey", scanSurfaceLabelTr(req.surfaceType)),
    row("Baskı isteniyor", req.wantsPrint ? "Evet" : "Hayır"),
    req.photoFileName
      ? row(
          "Referans foto",
          `${req.photoFileName}${
            req.photoFileSize
              ? ` (${Math.round(req.photoFileSize / 1024)} KB)`
              : ""
          }`
        )
      : "",
    req.note ? row("Not", req.note) : "",
  ].join("");

  const text = [
    subject,
    "",
    rowText("Talep no", req.id),
    rowText("Ad", req.name),
    rowText("E-posta", req.email),
    rowText("Telefon", req.phone),
    rowText("Şehir", req.city),
    rowText("Nesne", req.objectDescription),
    rowText("Tarama alanı", req.scanArea),
    rowText("Konum", scanLocationLabelTr(req.locationType)),
    rowText("Amaç", scanPurposeLabelTr(req.purpose)),
    rowText("Baskı", req.wantsPrint ? "Evet" : "Hayır"),
    req.photoFileName ? rowText("Foto", req.photoFileName) : "",
    req.note ? rowText("Not", req.note) : "",
  ]
    .filter(Boolean)
    .join("\n");

  const { html, text: plain } = emailShell(
    "Yeni 3D tarama teklif talebi",
    fields,
    text
  );
  return { subject, html, text: plain };
}
