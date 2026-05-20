import { stockGalleryImages } from "@/data/imageGallery";

const MAX_FILE_BYTES = 2 * 1024 * 1024;

export interface GalleryImage {
  id: string;
  label: string;
  url: string;
  source: "stock" | "upload";
}

function stockFallback(): GalleryImage[] {
  return stockGalleryImages.map((img) => ({
    ...img,
    source: "stock" as const,
  }));
}

export async function fetchAllGalleryImages(): Promise<GalleryImage[]> {
  try {
    const res = await fetch("/api/gallery", { credentials: "include" });
    if (!res.ok) return stockFallback();
    return (await res.json()) as GalleryImage[];
  } catch {
    return stockFallback();
  }
}

export async function saveUploadedImage(
  dataUrl: string,
  fileName: string
): Promise<GalleryImage> {
  const res = await fetch("/api/admin/gallery", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataUrl, fileName }),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || "Görsel yüklenemedi.");
  }

  return res.json() as Promise<GalleryImage>;
}

export async function deleteUploadedImage(id: string): Promise<void> {
  const res = await fetch(`/api/admin/gallery/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || "Görsel silinemedi.");
  }
}

/** @deprecated fetchAllGalleryImages kullanın */
export function getAllGalleryImages(): GalleryImage[] {
  return stockFallback();
}

export async function fileToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Lütfen bir görsel dosyası seçin (JPG, PNG, WebP).");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Dosya en fazla 2 MB olabilir.");
  }

  const dataUrl = await readFileAsDataUrl(file);
  return resizeDataUrlIfNeeded(dataUrl, 1200, 0.85);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Dosya okunamadı."));
    reader.readAsDataURL(file);
  });
}

function resizeDataUrlIfNeeded(
  dataUrl: string,
  maxWidth: number,
  quality: number
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.width <= maxWidth) {
        resolve(dataUrl);
        return;
      }
      const ratio = maxWidth / img.width;
      const canvas = document.createElement("canvas");
      canvas.width = maxWidth;
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
