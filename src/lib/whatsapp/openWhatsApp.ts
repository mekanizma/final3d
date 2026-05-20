import { WHATSAPP_NUMBER } from "@/lib/whatsapp/constants";

export function buildWhatsAppUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Yeni sekmede WhatsApp sohbetini form özetiyle açar */
export function openWhatsAppWithMessage(text: string): void {
  const url = buildWhatsAppUrl(text);
  window.open(url, "_blank", "noopener,noreferrer");
}
