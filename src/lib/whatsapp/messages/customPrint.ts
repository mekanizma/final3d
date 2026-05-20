import type { PrintMaterialId } from "@/lib/printMaterials";

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
    "🔵 *Final3d — Özel Baskı Teklif Talebi*",
    "",
    `👤 *Ad Soyad:* ${data.name}`,
    `📧 *E-posta:* ${data.email}`,
    `📱 *Telefon:* ${data.phone}`,
    "",
    `📁 *3D Dosya:* ${data.fileName} (${formatFileSize(data.fileSize)})`,
    "⚠️ _Lütfen dosyayı bu sohbete ekleyin (STL/OBJ/3MF)._",
    "",
    `🧵 *Malzeme:* ${data.materialLabel} (${data.material.toUpperCase()})`,
    `🎨 *Renk:* ${data.color.trim() || "Belirtilmedi"}`,
    `🔢 *Adet:* ${data.quantity}`,
  ];

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
