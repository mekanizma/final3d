import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapProfile, type DbProfile } from "@/lib/supabase/mappers";
import type { RegisterInput } from "@/types";

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as RegisterInput;
    const email = input.email.trim().toLowerCase();

    if (input.password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const { data: authData, error: authError } =
      await admin.auth.admin.createUser({
        email,
        password: input.password,
        email_confirm: true,
        user_metadata: {
          name: input.name.trim(),
          phone: input.phone.trim(),
          address: input.address.trim(),
        },
      });

    if (authError) {
      if (authError.message.toLowerCase().includes("already")) {
        return NextResponse.json(
          { error: "Bu e-posta adresi zaten kayıtlı." },
          { status: 409 }
        );
      }
      throw authError;
    }

    const userId = authData.user.id;
    await admin.from("profiles").upsert({
      id: userId,
      name: input.name.trim(),
      email,
      phone: input.phone.trim(),
      address: input.address.trim(),
    });

    const supabase = await createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: input.password,
    });

    if (signInError) throw signInError;

    const { data: profile } = await admin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    return NextResponse.json(mapProfile(profile as DbProfile));
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
