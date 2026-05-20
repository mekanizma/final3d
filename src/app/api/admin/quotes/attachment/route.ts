import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/api/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  PRINT_FILES_BUCKET,
  SCAN_PHOTOS_BUCKET,
  createSignedAttachmentUrl,
  isImageFileName,
} from "@/lib/storage/requestFiles";

export async function GET(req: Request) {
  try {
    await assertAdminSession();
    const { searchParams } = new URL(req.url);
    const kind = searchParams.get("kind");
    const id = searchParams.get("id");

    if (!id || (kind !== "custom" && kind !== "scan")) {
      return NextResponse.json({ error: "Geçersiz parametre." }, { status: 400 });
    }

    const supabase = createAdminClient();

    if (kind === "custom") {
      const { data, error } = await supabase
        .from("custom_print_requests")
        .select("file_name, file_storage_path")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data?.file_storage_path) {
        return NextResponse.json(
          { error: "Bu talep için yüklenmiş dosya yok." },
          { status: 404 }
        );
      }

      const url = await createSignedAttachmentUrl(
        PRINT_FILES_BUCKET,
        data.file_storage_path
      );

      return NextResponse.json({
        url,
        fileName: data.file_name as string,
        isImage: isImageFileName(data.file_name as string),
      });
    }

    const { data, error } = await supabase
      .from("scan_quote_requests")
      .select("photo_file_name, photo_storage_path")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data?.photo_storage_path) {
      return NextResponse.json(
        { error: "Bu talep için yüklenmiş fotoğraf yok." },
        { status: 404 }
      );
    }

    const fileName = (data.photo_file_name as string) || "photo.jpg";
    const url = await createSignedAttachmentUrl(
      SCAN_PHOTOS_BUCKET,
      data.photo_storage_path
    );

    return NextResponse.json({
      url,
      fileName,
      isImage: true,
    });
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Admin") ? 401 : 500 }
    );
  }
}
