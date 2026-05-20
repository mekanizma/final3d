import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/adminSession";
import { getSessionUser } from "@/lib/api/requireUser";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapOrder, type DbOrder } from "@/lib/supabase/mappers";
import { orderBelongsToUser } from "@/lib/orderOwnership";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json(null);

    const cookieStore = await cookies();
    const isAdmin = cookieStore.get(ADMIN_SESSION_COOKIE)?.value === "1";
    if (isAdmin) {
      return NextResponse.json(mapOrder(data as DbOrder));
    }

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const order = mapOrder(data as DbOrder);
    if (!orderBelongsToUser(order, user)) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
