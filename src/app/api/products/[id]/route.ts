import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapProduct, type DbProduct } from "@/lib/supabase/mappers";
import { normalizeProduct } from "@/lib/product-i18n";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json(null);
    return NextResponse.json(normalizeProduct(mapProduct(data as DbProduct)));
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
