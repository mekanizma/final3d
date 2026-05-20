import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/email/sendOrderConfirmation";
import type { Order } from "@/types";

function isValidOrder(payload: unknown): payload is Order {
  if (!payload || typeof payload !== "object") return false;
  const o = payload as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.customerName === "string" &&
    typeof o.phone === "string" &&
    typeof o.address === "string" &&
    Array.isArray(o.items) &&
    o.items.length > 0 &&
    typeof o.total === "number" &&
    typeof o.createdAt === "string" &&
    (o.userEmail === undefined || typeof o.userEmail === "string")
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = body?.order;

    if (!isValidOrder(order)) {
      return NextResponse.json(
        { sent: false, error: "Geçersiz sipariş verisi." },
        { status: 400 }
      );
    }

    const result = await sendOrderConfirmationEmail(order);

    if (result.error && !result.mock) {
      return NextResponse.json(result, { status: 502 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { sent: false, error: "İstek işlenemedi." },
      { status: 500 }
    );
  }
}
