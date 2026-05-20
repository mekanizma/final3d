import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/api/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapCustomPrint } from "@/lib/supabase/mappers";

type Params = { params: Promise<{ id: string }> };

const STATUSES = ["yeni", "inceleniyor", "teklif-gonderildi"] as const;

export async function PATCH(req: Request, { params }: Params) {
  try {
    await assertAdminSession();
    const { id } = await params;
    const { status } = (await req.json()) as { status: string };

    if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
      return NextResponse.json({ error: "Geçersiz durum" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("custom_print_requests")
      .update({ status })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json(mapCustomPrint(data));
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Admin") ? 401 : 500 }
    );
  }
}
