import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/api/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapProduct, productToDb, type DbProduct } from "@/lib/supabase/mappers";
import { normalizeProduct } from "@/lib/product-i18n";
import { buildProductTranslations } from "@/services/productTranslation";
import type { UpdateProductInput } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  try {
    await assertAdminSession();
    const { id } = await params;
    const input = (await req.json()) as UpdateProductInput;

    const supabase = createAdminClient();
    const { data: existing, error: fetchErr } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    const current = mapProduct(existing as DbProduct);
    const name = input.name ?? current.name;
    const description = input.description ?? current.description;
    const textChanged =
      (input.name !== undefined && input.name !== current.name) ||
      (input.description !== undefined &&
        input.description !== current.description);

    let translations = current.translations;
    if (textChanged) {
      translations = await buildProductTranslations(name, description);
    }

    const patch = productToDb({
      ...current,
      ...input,
      name,
      description,
      translations,
    });

    const { data, error } = await supabase
      .from("products")
      .update(patch)
      .eq("id", id)
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

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await assertAdminSession();
    const { id } = await params;
    const supabase = createAdminClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Admin") ? 401 : 500 }
    );
  }
}
