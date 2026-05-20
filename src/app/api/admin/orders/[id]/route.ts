import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/api/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapOrder, type DbOrder } from "@/lib/supabase/mappers";
import type { OrderStatus } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  try {
    await assertAdminSession();
    const { id } = await params;
    const { status } = (await req.json()) as { status: OrderStatus };

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json(mapOrder(data as DbOrder));
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
    const { error } = await supabase.from("orders").delete().eq("id", id);
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
