import { createAdminClient } from "@/lib/supabase/admin";

export const PRINT_FILES_BUCKET = "print-files";
export const SCAN_PHOTOS_BUCKET = "scan-photos";

const MAX_PRINT_BYTES = 50 * 1024 * 1024;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

const PRINT_EXT = new Set([
  "stl",
  "obj",
  "3mf",
  "zip",
  "step",
  "stp",
  "iges",
  "igs",
]);

const PHOTO_EXT = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif"]);

function sanitizeFileName(name: string): string {
  const base = name.replace(/[/\\?%*:|"<>]/g, "_").trim() || "file";
  return base.length > 180 ? base.slice(-180) : base;
}

function extOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

export function validatePrintFile(file: File): string | null {
  if (!file.size) return "3D dosya seçin.";
  if (file.size > MAX_PRINT_BYTES) return "Dosya en fazla 50 MB olabilir.";
  const ext = extOf(file.name);
  if (!PRINT_EXT.has(ext)) {
    return "STL, OBJ, 3MF veya ZIP yükleyin.";
  }
  return null;
}

export function validatePhotoFile(file: File): string | null {
  if (!file.size) return null;
  if (file.size > MAX_PHOTO_BYTES) return "Fotoğraf en fazla 10 MB olabilir.";
  const ext = extOf(file.name);
  if (!PHOTO_EXT.has(ext)) return "JPG, PNG veya WEBP yükleyin.";
  return null;
}

export async function uploadPrintFile(
  requestId: string,
  file: File
): Promise<string> {
  const err = validatePrintFile(file);
  if (err) throw new Error(err);

  const supabase = createAdminClient();
  const safeName = sanitizeFileName(file.name);
  const path = `${requestId}/${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(PRINT_FILES_BUCKET)
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });

  if (error) throw new Error(error.message);
  return path;
}

export async function uploadScanPhoto(
  requestId: string,
  file: File
): Promise<string> {
  const err = validatePhotoFile(file);
  if (err) throw new Error(err);

  const supabase = createAdminClient();
  const safeName = sanitizeFileName(file.name);
  const path = `${requestId}/${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(SCAN_PHOTOS_BUCKET)
    .upload(path, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

  if (error) throw new Error(error.message);
  return path;
}

export async function createSignedAttachmentUrl(
  bucket: string,
  path: string,
  expiresIn = 3600
): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error || !data?.signedUrl) {
    throw new Error(error?.message || "Dosya URL oluşturulamadı.");
  }
  return data.signedUrl;
}

export function isImageFileName(name: string): boolean {
  return PHOTO_EXT.has(extOf(name));
}
