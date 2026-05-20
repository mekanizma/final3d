import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/api/requireAdmin";
import { requireSessionUser } from "@/lib/api/requireUser";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapOrder, type DbOrder } from "@/lib/supabase/mappers";
import { generateId } from "@/lib/utils";
import { calculateOrderTotals } from "@/lib/pricing";
import type { CreateOrderInput } from "@/types";
import {
  isLegacyDemoProduct,
  withoutLegacyDemoOrders,
} from "@/lib/legacyDemoData";

export async function GET() {
  try {
    await assertAdminSession();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(
      withoutLegacyDemoOrders((data as DbOrder[]).map(mapOrder))
    );
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Admin") ? 401 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireSessionUser();
    const input = (await req.json()) as CreateOrderInput;
    const supabase = createAdminClient();

    const productIds = input.items.map((i) => i.productId);
    const { data: products, error: prodErr } = await supabase
      .from("products")
      .select("id, name, price, stock, translations")
      .in("id", productIds);

    if (prodErr) throw prodErr;

    const items = input.items.map((item) => {
      if (isLegacyDemoProduct(item.productId)) {
        throw new Error("Bu ürün artık satışta değil.");
      }
      const product = products?.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Ürün bulunamadı: ${item.productId}`);

      const stock = Number(product.stock);
      if (stock < item.quantity) {
        const translations = product.translations as Record<
          string,
          { name?: string }
        > | null;
        const name = translations?.tr?.name ?? (product.name as string);
        throw new Error(`"${name}" için yeterli stok yok (kalan: ${stock}).`);
      }

      const translations = product.translations as Record<
        string,
        { name?: string }
      > | null;
      const displayName = translations?.tr?.name ?? (product.name as string);
      return {
        productId: product.id as string,
        productName: displayName,
        quantity: item.quantity,
        price: Number(product.price),
        stockBefore: stock,
      };
    });

    const subtotal = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const pricing = calculateOrderTotals(subtotal);
    const id = generateId("ord");

    const row = {
      id,
      customer_name: input.customerName,
      phone: input.phone,
      address: input.address,
      items: items.map(({ stockBefore: _, ...rest }) => rest),
      note: input.note ?? null,
      payment_method: "kapida-odeme",
      status: "yeni",
      subtotal: pricing.subtotal,
      shipping_fee: pricing.shippingFee,
      total: pricing.total,
      user_id: user.id,
      user_email: user.email,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("orders")
      .insert(row)
      .select("*")
      .single();

    if (error) throw error;

    for (const item of items) {
      const { error: stockErr } = await supabase
        .from("products")
        .update({ stock: item.stockBefore - item.quantity })
        .eq("id", item.productId);
      if (stockErr) throw stockErr;
    }

    return NextResponse.json(mapOrder(data as DbOrder));
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Oturum") ? 401 : 500 }
    );
  }
}
