import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/api/requireUser";
import { generateId } from "@/lib/utils";
import { mapScanQuote } from "@/lib/supabase/mappers";
import { uploadScanPhoto } from "@/lib/storage/requestFiles";
import {
  asMultipartForm,
  readFormBool,
  readFormFile,
  readFormString,
} from "@/lib/api/parseMultipart";
import { sendScanQuoteEmail } from "@/lib/email/sendScanQuoteEmail";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    const supabase = createAdminClient();
    const contentType = req.headers.get("content-type") ?? "";

    const id = generateId("scan");
    let photoFile: File | null = null;
    let name = "";
    let email = "";
    let phone = "";
    let objectDescription = "";
    let scanArea = "";
    let quantity = "1";
    let locationType = "studio";
    let locationAddress = "";
    let city = "";
    let purpose = "print";
    let surfaceType = "standard";
    let wantsPrint = false;
    let note = "";
    let formUserId: string | null = null;
    let delivery: "whatsapp" | "email" = "whatsapp";

    if (contentType.includes("multipart/form-data")) {
      const fd = asMultipartForm(await req.formData());
      const d = readFormString(fd, "delivery", "whatsapp");
      if (d === "email") delivery = "email";
      name = readFormString(fd, "name");
      email = readFormString(fd, "email");
      phone = readFormString(fd, "phone");
      objectDescription = readFormString(fd, "objectDescription");
      scanArea = readFormString(fd, "scanArea");
      quantity = readFormString(fd, "quantity", "1");
      locationType = readFormString(fd, "locationType", "studio");
      locationAddress = readFormString(fd, "locationAddress");
      city = readFormString(fd, "city");
      purpose = readFormString(fd, "purpose", "print");
      surfaceType = readFormString(fd, "surfaceType", "standard");
      wantsPrint = readFormBool(fd, "wantsPrint");
      note = readFormString(fd, "note");
      const uid = readFormString(fd, "userId");
      if (uid) formUserId = uid;
      photoFile = readFormFile(fd, "referencePhoto");
    } else {
      const input = (await req.json()) as Record<string, unknown>;
      name = String(input.name ?? "").trim();
      email = String(input.email ?? "").trim();
      phone = String(input.phone ?? "").trim();
      objectDescription = String(input.objectDescription ?? "").trim();
      scanArea = String(input.scanArea ?? "").trim();
      quantity = String(input.quantity ?? "1").trim();
      locationType = String(input.locationType ?? "studio");
      locationAddress = String(input.locationAddress ?? "").trim();
      city = String(input.city ?? "").trim();
      purpose = String(input.purpose ?? "print");
      surfaceType = String(input.surfaceType ?? "standard");
      wantsPrint = Boolean(input.wantsPrint);
      note = String(input.note ?? "").trim();
      if (input.userId) formUserId = String(input.userId);
    }

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Ad, e-posta ve telefon zorunludur." },
        { status: 400 }
      );
    }

    let photoStoragePath: string | null = null;
    let photoFileName: string | null = null;
    let photoFileSize: number | null = null;

    if (photoFile?.size) {
      photoStoragePath = await uploadScanPhoto(id, photoFile);
      photoFileName = photoFile.name;
      photoFileSize = photoFile.size;
    }

    const row = {
      id,
      name,
      email,
      phone,
      object_description: objectDescription,
      scan_area: scanArea,
      quantity,
      location_type: locationType,
      location_address: locationAddress,
      city,
      purpose,
      surface_type: surfaceType,
      wants_print: wantsPrint,
      note,
      photo_file_name: photoFileName,
      photo_file_size: photoFileSize,
      photo_storage_path: photoStoragePath,
      user_id: user?.id ?? formUserId,
      status: "yeni",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("scan_quote_requests")
      .insert(row)
      .select("*")
      .single();

    if (error) throw error;

    const mapped = mapScanQuote(data as Record<string, unknown>);
    let notification;

    if (delivery === "email") {
      notification = await sendScanQuoteEmail(mapped, photoFile);
    }

    return NextResponse.json(
      notification ? { ...mapped, notification } : mapped
    );
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
