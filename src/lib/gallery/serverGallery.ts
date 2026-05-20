import { createAdminClient } from "@/lib/supabase/admin";
import { generateId } from "@/lib/utils";

const BUCKET = "product-images";
const MAX_DATA_URL_DB = 500_000;

export type GalleryImageDto = {
  id: string;
  label: string;
  url: string;
  source: "upload";
};

export async function listUploadedGallery(): Promise<GalleryImageDto[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("gallery_uploads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id as string,
    label: row.label as string,
    url: row.url as string,
    source: "upload" as const,
  }));
}

export async function listAllGallery(): Promise<GalleryImageDto[]> {
  return listUploadedGallery();
}

function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; contentType: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Geçersiz görsel verisi.");
  return {
    contentType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

export async function saveGalleryUpload(
  dataUrl: string,
  fileName: string
): Promise<GalleryImageDto> {
  const supabase = createAdminClient();
  const id = generateId("gal");
  const label = fileName.replace(/\.[^.]+$/, "") || "Yüklenen görsel";
  const { buffer, contentType } = dataUrlToBuffer(dataUrl);
  const ext = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
      ? "webp"
      : "jpg";
  const path = `${id}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType, upsert: false });

  let url = dataUrl;
  if (!uploadErr) {
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    url = pub.publicUrl;
  } else if (dataUrl.length > MAX_DATA_URL_DB) {
    throw new Error(
      "Supabase Storage bucket 'product-images' yapılandırın veya daha küçük görsel kullanın."
    );
  }

  const { error: dbErr } = await supabase.from("gallery_uploads").insert({
    id,
    label,
    url,
    created_at: new Date().toISOString(),
  });

  if (dbErr) throw dbErr;

  return { id, label, url, source: "upload" };
}

export async function deleteGalleryUpload(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { data: row } = await supabase
    .from("gallery_uploads")
    .select("url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("gallery_uploads").delete().eq("id", id);
  if (error) throw error;

  if (
    row?.url &&
    typeof row.url === "string" &&
    row.url.includes("/storage/v1/object/public/product-images/")
  ) {
    const path = row.url.split("/product-images/")[1];
    if (path) {
      await supabase.storage.from(BUCKET).remove([path]);
    }
  }
}
