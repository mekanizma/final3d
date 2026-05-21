/** Tarayıcıda blob indirme — revoke gecikmeli, DOM'a eklenmiş anchor */

export function filenameFromDisposition(
  header: string | null,
  fallback: string
): string {
  if (!header) return fallback;
  const utf8 = /filename\*=UTF-8''([^;\s]+)/i.exec(header);
  if (utf8) {
    try {
      return decodeURIComponent(utf8[1]);
    } catch {
      return fallback;
    }
  }
  const quoted = /filename="([^"]+)"/i.exec(header);
  if (quoted) return quoted[1];
  const plain = /filename=([^;\s]+)/i.exec(header);
  if (plain) return plain[1].replace(/"/g, "");
  return fallback;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function openOrDownloadBlob(
  blob: Blob,
  filename: string
): Promise<"opened" | "downloaded"> {
  const url = URL.createObjectURL(blob);
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (opened) {
    setTimeout(() => URL.revokeObjectURL(url), 120_000);
    return "opened";
  }
  downloadBlob(blob, filename);
  return "downloaded";
}
