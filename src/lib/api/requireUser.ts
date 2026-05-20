import { createClient } from "@/lib/supabase/server";
import { mapProfile, type DbProfile } from "@/lib/supabase/mappers";
import type { UserPublic } from "@/types";

export async function getSessionUser(): Promise<UserPublic | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile) return mapProfile(profile as DbProfile);

  return {
    id: user.id,
    name: (user.user_metadata?.name as string) ?? user.email?.split("@")[0] ?? "",
    email: user.email ?? "",
    phone: (user.user_metadata?.phone as string) ?? "",
    address: (user.user_metadata?.address as string) ?? "",
    createdAt: user.created_at,
  };
}

export async function requireSessionUser(): Promise<UserPublic> {
  const user = await getSessionUser();
  if (!user) throw new Error("Oturum gerekli.");
  return user;
}
