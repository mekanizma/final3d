import { NextResponse } from "next/server";
import { listAllGallery } from "@/lib/gallery/serverGallery";

export async function GET() {
  try {
    const images = await listAllGallery();
    return NextResponse.json(images);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
