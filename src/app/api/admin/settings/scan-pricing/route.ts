import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/api/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_SCAN_PRICING_CONFIG,
  parseScanPricingConfig,
  type ScanPricingConfig,
} from "@/lib/scanPricingConfig";

const SETTINGS_ID = "default";

export async function GET() {
  try {
    await assertAdminSession();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("admin_settings")
      .select("scan_pricing_config")
      .eq("id", SETTINGS_ID)
      .maybeSingle();

    if (error) throw error;

    const config = parseScanPricingConfig(
      data?.scan_pricing_config ?? DEFAULT_SCAN_PRICING_CONFIG
    );

    return NextResponse.json(config);
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Admin") ? 401 : 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await assertAdminSession();
    const config: ScanPricingConfig = parseScanPricingConfig(await req.json());
    const supabase = createAdminClient();

    const { error } = await supabase.from("admin_settings").upsert({
      id: SETTINGS_ID,
      scan_pricing_config: config,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    return NextResponse.json(config);
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Admin") ? 401 : 500 }
    );
  }
}
