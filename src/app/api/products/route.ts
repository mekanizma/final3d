import { NextResponse } from "next/server";
import { listProducts } from "@/lib/products/listProducts";

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json(products);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
