import type { PrintMaterialId } from "@/lib/printMaterials";
import {
  formatRequestTime,
  waLine,
  waNote,
  waTitle,
} from "@/lib/whatsapp/formatMessage";

export type CustomPrintWhatsAppPayload = {
  name: string;
  email: string;
  phone: string;
  material: PrintMaterialId;
  materialLabel: string;
  color: string;
  quantity: string;
  note: string;
  fileName: string;
  fileSize: number;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function buildCustomPrintWhatsAppMessage(
  data: CustomPrintWhatsAppPayload
): string {
  const lines = [
    waTitle("Final3d - Özel Baskı Teklif Talebi"),
    "",
    waLine("Ad Soyad", data.name),
    waLine("E-posta", data.email),
    waLine("Telefon", data.phone),
    "",
    waLine("3D Dosya", `${data.fileName} (${formatFileSize(data.fileSize)})`),
    waNote("Lütfen dosyayı bu sohbete ekleyin (STL/OBJ/3MF)."),
    "",
    waLine("Malzeme", `${data.materialLabel} (${data.material.toUpperCase()})`),
    waLine("Renk", data.color.trim() || "Belirtilmedi"),
    waLine("Adet", data.quantity),
  ];

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
