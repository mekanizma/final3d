/** WhatsApp Business numarası (ülke kodu, + işareti olmadan) */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ||
  "905338398293";

export const WHATSAPP_GREETING =
  "Merhaba Final3d ekibi 👋 Sipariş / 3D tarama / özel baskı hakkında bilgi almak istiyorum.";
