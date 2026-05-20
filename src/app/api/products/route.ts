import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapProduct, type DbProduct } from "@/lib/supabase/mappers";
import { normalizeProduct } from "@/lib/product-i18n";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    const products = (data as DbProduct[]).map(mapProduct).map(normalizeProduct);
    return NextResponse.json(products);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
