import type {
  ScanLocationId,
  ScanPurposeId,
  ScanSurfaceId,
} from "@/lib/scanQuoteOptions";
import {
  formatRequestTime,
  waLine,
  waNote,
  waTitle,
} from "@/lib/whatsapp/formatMessage";

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
    waTitle("Final3d - 3D Tarama Teklif Talebi"),
    "",
    waLine("Ad Soyad", data.name),
    waLine("E-posta", data.email),
    waLine("Telefon", data.phone),
    "",
    waLine("Nesne / parça", data.objectDescription),
    waLine("Taranacak alan", data.scanArea),
    waLine("Adet", data.quantity),
    "",
    waLine("Amaç", data.purposeLabel),
    waLine("Yüzey tipi", data.surfaceLabel),
    "",
    waLine("Konum", data.locationLabel),
  ];

  if (data.locationType === "onsite" && data.locationAddress.trim()) {
    lines.push(waLine("Saha adresi", data.locationAddress.trim()));
  }

  if (data.city.trim()) {
    lines.push(waLine("Şehir", data.city.trim()));
  }

  lines.push(
    waLine("Tarama sonrası baskı", data.wantsPrint ? "Evet" : "Hayır")
  );

  if (data.photoFileName) {
    const size = data.photoFileSize
      ? ` (${formatFileSize(data.photoFileSize)})`
      : "";
    lines.push(
      "",
      waLine("Referans fotoğraf", `${data.photoFileName}${size}`),
      waNote("Lütfen fotoğrafı bu sohbete ekleyin.")
    );
  }

  if (data.note.trim()) {
    lines.push(waLine("Not", data.note.trim()));
  }

  lines.push(
    "",
    waLine("Talep zamanı", formatRequestTime()),
    "",
    "Teşekkürler."
  );

  return lines.join("\n");
}
