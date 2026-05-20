import { stockGalleryImages } from "@/data/imageGallery";

const UPLOADS_KEY = "print3d_uploaded_images";
const MAX_UPLOADS = 24;
const MAX_FILE_BYTES = 2 * 1024 * 1024;

export interface GalleryImage {
  id: string;
  label: string;
  url: string;
  source: "stock" | "upload";
}

interface StoredUpload {
  id: string;
  label: string;
  url: string;
  createdAt: string;
}

function readUploads(): StoredUpload[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(UPLOADS_KEY);
    return raw ? (JSON.parse(raw) as StoredUpload[]) : [];
  } catch {
    return [];
  }
}

function writeUploads(uploads: StoredUpload[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(UPLOADS_KEY, JSON.stringify(uploads));
}

export function getAllGalleryImages(): GalleryImage[] {
  const stock: GalleryImage[] = stockGalleryImages.map((img) => ({
    ...img,
    source: "stock" as const,
  }));
  const uploads: GalleryImage[] = readUploads().map((img) => ({
    id: img.id,
    label: img.label,
    url: img.url,
    source: "upload" as const,
  }));
  return [...uploads, ...stock];
}

export function saveUploadedImage(
  dataUrl: string,
  fileName: string
): GalleryImage {
  const uploads = readUploads();
  const item: StoredUpload = {
    id: `upload-${Date.now()}`,
    label: fileName.replace(/\.[^.]+$/, "") || "Yüklenen görsel",
    url: dataUrl,
    createdAt: new Date().toISOString(),
  };
  const next = [item, ...uploads].slice(0, MAX_UPLOADS);
  writeUploads(next);
  return { ...item, source: "upload" };
}

export function deleteUploadedImage(id: string) {
  writeUploads(readUploads().filter((u) => u.id !== id));
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
