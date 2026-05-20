import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapProfile, type DbProfile } from "@/lib/supabase/mappers";
import type { LoginInput } from "@/types";

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as LoginInput;
    const email = input.email.trim().toLowerCase();
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: input.password,
    });

    if (error) {
      return NextResponse.json(
        { error: "E-posta veya şifre hatalı." },
        { status: 401 }
      );
    }

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profile) {
      return NextResponse.json(mapProfile(profile as DbProfile));
    }

    return NextResponse.json({
      id: data.user.id,
      name: (data.user.user_metadata?.name as string) ?? "",
      email: data.user.email ?? email,
      phone: (data.user.user_metadata?.phone as string) ?? "",
      address: (data.user.user_metadata?.address as string) ?? "",
      createdAt: data.user.created_at,
    });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
