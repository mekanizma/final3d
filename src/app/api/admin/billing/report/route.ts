import { NextResponse } from "next/server";

export const runtime = "nodejs";
import { assertAdminSession } from "@/lib/api/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapOrder, type DbOrder } from "@/lib/supabase/mappers";
import { withoutLegacyDemoOrders } from "@/lib/legacyDemoData";
import { buildSalesReport } from "@/lib/billing/buildReport";
import { generateSalesPdfBuffer } from "@/lib/billing/pdfReport";
import {
  resolvePeriodRange,
  type BillingPeriod,
  type PeriodQuery,
} from "@/lib/billing/period";

function parseQuery(req: Request): PeriodQuery {
  const url = new URL(req.url);
  const period = (url.searchParams.get("period") ?? "monthly") as BillingPeriod;
  return {
    period,
    date: url.searchParams.get("date") ?? undefined,
    month: url.searchParams.get("month") ?? undefined,
    year: url.searchParams.get("year") ?? undefined,
    from: url.searchParams.get("from") ?? undefined,
    to: url.searchParams.get("to") ?? undefined,
  };
}

export async function GET(req: Request) {
  try {
    await assertAdminSession();
    const query = parseQuery(req);
    const range = resolvePeriodRange(query);
    const format = new URL(req.url).searchParams.get("format") ?? "json";

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .gte("created_at", range.startIso)
      .lte("created_at", range.endIso)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const orders = withoutLegacyDemoOrders(
      (data as DbOrder[]).map(mapOrder)
    );
    const report = buildSalesReport(orders, range);

    if (format === "pdf") {
      const buffer = await generateSalesPdfBuffer(report);
      const slug = range.period;
      const filename = `final3d-satis-${slug}-${range.startIso.slice(0, 10)}.pdf`;
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    return NextResponse.json(report);
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json(
      { error: msg },
      { status: msg.includes("Admin") ? 401 : 400 }
    );
  }
}
