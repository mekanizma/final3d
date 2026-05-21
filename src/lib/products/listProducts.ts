import { createAdminClient } from "@/lib/supabase/admin";
import { mapProduct, type DbProduct } from "@/lib/supabase/mappers";
import { normalizeProduct } from "@/lib/product-i18n";
import { withoutLegacyDemoProducts } from "@/lib/legacyDemoData";
import type { Product } from "@/types";

export async function listProducts(): Promise<Product[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return withoutLegacyDemoProducts(
    (data as DbProduct[]).map(mapProduct).map(normalizeProduct)
  );
}
