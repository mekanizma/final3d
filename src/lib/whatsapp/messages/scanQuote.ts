import type {
  ScanLocationId,
  ScanPurposeId,
  ScanSurfaceId,
} from "@/lib/scanQuoteOptions";

export type ScanQuoteWhatsAppPayload = {
  name: string;
  email: string;
  phone: string;
  objectDescription: string;
  scanArea: string;
  quantity: string;
  locationType: ScanLocationId;
  locationLabel: string;
  locationAddress: string;
  city: string;
  purpose: ScanPurposeId;
  purposeLabel: string;
  surfaceType: ScanSurfaceId;
  surfaceLabel: string;
  wantsPrint: boolean;
  note: string;
  photoFileName?: string;
  photoFileSize?: number;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function buildScanQuoteWhatsAppMessage(
  data: ScanQuoteWhatsAppPayload
): string {
  const lines = [
    "🟢 *Final3d — 3D Tarama Teklif Talebi*",
    "",
    `👤 *Ad Soyad:* ${data.name}`,
    `📧 *E-posta:* ${data.email}`,
    `📱 *Telefon:* ${data.phone}`,
    "",
    `📦 *Nesne / parça:* ${data.objectDescription}`,
    `📐 *Taranacak alan:* ${data.scanArea}`,
    `🔢 *Adet:* ${data.quantity}`,
    "",
    `🎯 *Amaç:* ${data.purposeLabel}`,
    `🔍 *Yüzey tipi:* ${data.surfaceLabel}`,
    "",
    `📍 *Konum:* ${data.locationLabel}`,
  ];

  if (data.locationType === "onsite" && data.locationAddress.trim()) {
    lines.push(`🏠 *Saha adresi:* ${data.locationAddress.trim()}`);
  }

  if (data.city.trim()) {
    lines.push(`🌆 *Şehir:* ${data.city.trim()}`);
  }

  lines.push(
    `🖨️ *Tarama sonrası baskı:* ${data.wantsPrint ? "Evet" : "Hayır"}`
  );

  if (data.photoFileName) {
    const size = data.photoFileSize
      ? ` (${formatFileSize(data.photoFileSize)})`
      : "";
    lines.push("", `📷 *Referans fotoğraf:* ${data.photoFileName}${size}`);
    lines.push("⚠️ _Lütfen fotoğrafı bu sohbete ekleyin._");
  }

  if (data.note.trim()) {
    lines.push(`📝 *Not:* ${data.note.trim()}`);
  }

  lines.push(
    "",
    `🕐 *Talep zamanı:* ${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Nicosia" })}`,
    "",
    "Teşekkürler 🙏"
  );

  return lines.join("\n");
}
