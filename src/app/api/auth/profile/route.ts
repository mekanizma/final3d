import { NextResponse } from "next/server";
import { requireSessionUser } from "@/lib/api/requireUser";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapProfile, type DbProfile } from "@/lib/supabase/mappers";
import type { UpdateProfileInput } from "@/types";

export async function PATCH(req: Request) {
  try {
    const user = await requireSessionUser();
    const input = (await req.json()) as UpdateProfileInput;

    const patch = {
      name: input.name?.trim() ?? user.name,
      phone: input.phone?.trim() ?? user.phone,
      address: input.address?.trim() ?? user.address,
    };

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", user.id)
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json(mapProfile(data as DbProfile));
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Oturum") ? 401 : 500 }
    );
  }
}
