import { NextResponse } from "next/server";
import { assertAdminSession } from "@/lib/api/requireAdmin";
import { listAllGallery, saveGalleryUpload } from "@/lib/gallery/serverGallery";

export async function GET() {
  try {
    await assertAdminSession();
    return NextResponse.json(await listAllGallery());
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Admin") ? 401 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await assertAdminSession();
    const body = (await req.json()) as { dataUrl?: string; fileName?: string };
    if (!body.dataUrl?.trim()) {
      return NextResponse.json({ error: "Görsel verisi gerekli." }, { status: 400 });
    }
    const saved = await saveGalleryUpload(
      body.dataUrl,
      body.fileName ?? "upload.jpg"
    );
    return NextResponse.json(saved);
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Admin") ? 401 : 500 }
    );
  }
}
