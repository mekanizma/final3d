import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/api/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapCustomPrint, mapScanQuote } from "@/lib/supabase/mappers";

export async function GET() {
  try {
    await assertAdminSession();
    const supabase = createAdminClient();

    const [customRes, scanRes] = await Promise.all([
      supabase
        .from("custom_print_requests")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("scan_quote_requests")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (customRes.error) throw customRes.error;
    if (scanRes.error) throw scanRes.error;

    return NextResponse.json({
      custom: (customRes.data ?? []).map((r) =>
        mapCustomPrint(r as Record<string, unknown>)
      ),
      scan: (scanRes.data ?? []).map((r) =>
        mapScanQuote(r as Record<string, unknown>)
      ),
    });
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Admin") ? 401 : 500 }
    );
  }
}
