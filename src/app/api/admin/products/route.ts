import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/api/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapProduct, productToDb, type DbProduct } from "@/lib/supabase/mappers";
import { generateId } from "@/lib/utils";
import { normalizeProduct } from "@/lib/product-i18n";
import { buildProductTranslations } from "@/services/productTranslation";
import type { CreateProductInput } from "@/types";

export async function POST(req: Request) {
  try {
    await assertAdminSession();
    const input = (await req.json()) as CreateProductInput;
    const translations = await buildProductTranslations(
      input.name,
      input.description
    );
    const id = generateId("prod");
    const row = {
      id,
      ...productToDb({ ...input, translations }),
      created_at: new Date().toISOString(),
    };

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .insert(row)
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json(normalizeProduct(mapProduct(data as DbProduct)));
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Admin") ? 401 : 500 }
    );
  }
}
