import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/api/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapScanQuote } from "@/lib/supabase/mappers";

export async function GET() {
  try {
    await assertAdminSession();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("scan_quote_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json((data ?? []).map(mapScanQuote));
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Admin") ? 401 : 500 }
    );
  }
}
