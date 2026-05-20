import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/api/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  PRINT_COST_DEFAULTS,
  type PrintCostInputs,
} from "@/lib/printCostCalculator";

const SETTINGS_ID = "default";

export async function GET() {
  try {
    await assertAdminSession();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("admin_settings")
      .select("print_cost_inputs")
      .eq("id", SETTINGS_ID)
      .maybeSingle();

    if (error) throw error;

    const inputs =
      (data?.print_cost_inputs as PrintCostInputs | null) ?? {
        ...PRINT_COST_DEFAULTS,
      };

    return NextResponse.json(inputs);
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
    const inputs = (await req.json()) as PrintCostInputs;
    const supabase = createAdminClient();

    const { error } = await supabase.from("admin_settings").upsert({
      id: SETTINGS_ID,
      print_cost_inputs: inputs,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    return NextResponse.json(inputs);
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Admin") ? 401 : 500 }
    );
  }
}
