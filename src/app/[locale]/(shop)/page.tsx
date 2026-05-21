import { HomePageContent } from "@/components/home/HomePageContent";
import { listProducts } from "@/lib/products/listProducts";

export default async function HomePage() {
  let initialProducts: Awaited<ReturnType<typeof listProducts>> = [];
  try {
    initialProducts = await listProducts();
  } catch {
    /* Supabase yoksa istemci /api/products ile dener */
  }

  return <HomePageContent initialProducts={initialProducts} />;
}
