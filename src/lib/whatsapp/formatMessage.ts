/** wa.me on metin alanında emoji ve özel Unicode bozulabiliyor; güvenli metin. */
export function sanitizeWhatsAppText(value: string): string {
  return value
    .replace(/\u2014/g, "-")
    .replace(/\u2013/g, "-")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function waLine(label: string, value: string): string {
  return `*${sanitizeWhatsAppText(label)}:* ${sanitizeWhatsAppText(value)}`;
}

export function waTitle(text: string): string {
  return `*${sanitizeWhatsAppText(text)}*`;
}

export function waNote(text: string): string {
  return sanitizeWhatsAppText(text);
}

export function formatRequestTime(): string {
  return new Date().toLocaleString("tr-TR", { timeZone: "Europe/Nicosia" });
}
