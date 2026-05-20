import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/api/requireUser";
import { generateId } from "@/lib/utils";
import type { SubmitScanQuoteInput } from "@/services/scanRequestService";

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as SubmitScanQuoteInput;
    const user = await getSessionUser();
    const supabase = createAdminClient();

    const row = {
      id: generateId("scan"),
      name: input.name,
      email: input.email,
      phone: input.phone,
      object_description: input.objectDescription,
      scan_area: input.scanArea,
      quantity: input.quantity,
      location_type: input.locationType,
      location_address: input.locationAddress,
      city: input.city,
      purpose: input.purpose,
      surface_type: input.surfaceType,
      wants_print: input.wantsPrint,
      note: input.note ?? "",
      photo_file_name: input.photoFileName ?? null,
      photo_file_size: input.photoFileSize ?? null,
      user_id: user?.id ?? input.userId ?? null,
      status: "yeni",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("scan_quote_requests")
      .insert(row)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      objectDescription: data.object_description,
      scanArea: data.scan_area,
      quantity: data.quantity,
      locationType: data.location_type,
      locationAddress: data.location_address,
      city: data.city,
      purpose: data.purpose,
      surfaceType: data.surface_type,
      wantsPrint: data.wants_print,
      note: data.note,
      photoFileName: data.photo_file_name ?? undefined,
      photoFileSize: data.photo_file_size ?? undefined,
      userId: data.user_id ?? undefined,
      status: data.status,
      createdAt: data.created_at,
    });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
