import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/api/requireUser";
import { generateId } from "@/lib/utils";
import { mapCustomPrint } from "@/lib/supabase/mappers";
import { uploadPrintFile } from "@/lib/storage/requestFiles";
import {
  readFormFile,
  readFormString,
  readMultipartBody,
} from "@/lib/api/parseMultipartBody";
import type { PrintMaterialId } from "@/lib/printMaterials";
import { sendCustomPrintQuoteEmail } from "@/lib/email/sendCustomPrintQuoteEmail";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    const supabase = createAdminClient();
    const contentType = req.headers.get("content-type") ?? "";

    let id = generateId("cpr");
    let name: string;
    let email: string;
    let phone: string;
    let material: PrintMaterialId;
    let color: string;
    let quantity: string;
    let note = "";
    let fileName = "";
    let fileSize = 0;
    let userId: string | null = user?.id ?? null;
    let modelFile: File | null = null;
    let delivery: "whatsapp" | "email" | "form" = "whatsapp";

    if (contentType.includes("multipart/form-data")) {
      const fd = await readMultipartBody(req);
      const d = readFormString(fd, "delivery", "whatsapp");
      if (d === "email" || d === "form") delivery = d;
      name = readFormString(fd, "name");
      email = readFormString(fd, "email");
      phone = readFormString(fd, "phone");
      material = readFormString(fd, "material", "pla") as PrintMaterialId;
      color = readFormString(fd, "color");
      quantity = readFormString(fd, "quantity", "1");
      note = readFormString(fd, "note");
      const uid = readFormString(fd, "userId");
      if (uid) userId = uid;
      const f = readFormFile(fd, "modelFile");
      if (f) {
        modelFile = f;
        fileName = f.name;
        fileSize = f.size;
      }
    } else {
      const input = (await req.json()) as {
        name: string;
        email: string;
        phone: string;
        material: PrintMaterialId;
        color: string;
        quantity: string;
        note?: string;
        fileName: string;
        fileSize: number;
        userId?: string;
      };
      name = input.name;
      email = input.email;
      phone = input.phone;
      material = input.material;
      color = input.color;
      quantity = input.quantity;
      note = input.note ?? "";
      fileName = input.fileName;
      fileSize = input.fileSize;
      userId = user?.id ?? input.userId ?? null;
    }

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Ad, e-posta ve telefon zorunludur." },
        { status: 400 }
      );
    }
    if (!modelFile?.size && !fileName) {
      return NextResponse.json({ error: "3D dosya gerekli." }, { status: 400 });
    }
    if (delivery === "email" && !modelFile?.size) {
      return NextResponse.json(
        { error: "E-posta ile gönderim için 3D dosya ekleyin." },
        { status: 400 }
      );
    }

    const row = {
      id,
      name,
      email,
      phone,
      material,
      color,
      quantity,
      note,
      file_name: fileName,
      file_size: fileSize,
      file_storage_path: null as string | null,
      user_id: userId,
      status: "yeni",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("custom_print_requests")
      .insert(row)
      .select("*")
      .single();

    if (error) {
      const msg = error.message ?? "";
      if (/file_storage_path/i.test(msg)) {
        throw new Error(
          "Veritabanı güncel değil: supabase/migrations/004_quote_attachments.sql dosyasını Supabase SQL Editor'da çalıştırın."
        );
      }
      throw error;
    }

    let storageWarning: string | undefined;
    if (modelFile?.size) {
      try {
        const path = await uploadPrintFile(id, modelFile);
        const { error: upErr } = await supabase
          .from("custom_print_requests")
          .update({ file_storage_path: path })
          .eq("id", id);
        if (upErr) throw upErr;
        (data as Record<string, unknown>).file_storage_path = path;
      } catch (uploadErr) {
        storageWarning = (uploadErr as Error).message;
        console.error("[custom-print] dosya yüklenemedi:", storageWarning);
      }
    }

    const mapped = mapCustomPrint(data as Record<string, unknown>);
    let notification;

    if (delivery === "email") {
      notification = await sendCustomPrintQuoteEmail(mapped, modelFile);
    }

    return NextResponse.json({
      ...mapped,
      ...(notification ? { notification } : {}),
      ...(storageWarning ? { storageWarning } : {}),
    });
  } catch (e) {
    const msg = (e as Error).message;
    const isParse =
      /formdata|multipart|boundary|parse/i.test(msg) ||
      msg.includes("Form verisi");
    return NextResponse.json(
      {
        error: isParse
          ? "Form gönderilemedi. Sayfayı yenileyin; dosya STL/OBJ/ZIP ve en fazla 50 MB olmalı."
          : msg,
      },
      { status: isParse ? 400 : 500 }
    );
  }
}
