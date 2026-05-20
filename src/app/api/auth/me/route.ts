import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/api/requireUser";

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
