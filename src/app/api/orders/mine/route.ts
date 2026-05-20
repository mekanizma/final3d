import { NextResponse } from "next/server";
import { requireSessionUser } from "@/lib/api/requireUser";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapOrder, type DbOrder } from "@/lib/supabase/mappers";

export async function GET() {
  try {
    const user = await requireSessionUser();
    const supabase = createAdminClient();
    const email = user.email.trim().toLowerCase();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .or(`user_id.eq.${user.id},user_email.ilike.${email}`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json((data as DbOrder[]).map(mapOrder));
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Oturum") ? 401 : 500 }
    );
  }
}
