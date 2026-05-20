import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/api/requireUser";
import { generateId } from "@/lib/utils";
import type { SubmitCustomPrintInput } from "@/services/customPrintService";

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as SubmitCustomPrintInput;
    const user = await getSessionUser();
    const supabase = createAdminClient();

    const row = {
      id: generateId("cpr"),
      name: input.name,
      email: input.email,
      phone: input.phone,
      material: input.material,
      color: input.color,
      quantity: input.quantity,
      note: input.note ?? "",
      file_name: input.fileName,
      file_size: input.fileSize,
      user_id: user?.id ?? input.userId ?? null,
      status: "yeni",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("custom_print_requests")
      .insert(row)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      material: data.material,
      color: data.color,
      quantity: data.quantity,
      note: data.note,
      fileName: data.file_name,
      fileSize: data.file_size,
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
