import { resolveOrderTotals } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderItem, OrderStatus } from "@/types";
import type { PeriodRange } from "@/lib/billing/period";
import { orderInRange } from "@/lib/billing/period";

export interface StatusBreakdown {
  status: OrderStatus;
  count: number;
  revenue: number;
}

export interface DailyBreakdown {
  date: string;
  dateLabel: string;
  orderCount: number;
  revenue: number;
  subtotal: number;
}

export interface ReportOrderRow {
  id: string;
  createdAt: string;
  createdAtLabel: string;
  customerName: string;
  phone: string;
  address: string;
  status: OrderStatus;
  userEmail?: string;
  note?: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  itemCount: number;
  items: OrderItem[];
}

export interface ReportLineItem {
  orderId: string;
  orderDate: string;
  orderDateLabel: string;
  customerName: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface SalesReport {
  range: PeriodRange;
  generatedAt: string;
  generatedAtLabel: string;
  summary: {
    orderCount: number;
    lineItemCount: number;
    unitsSold: number;
    subtotal: number;
    shippingTotal: number;
    revenue: number;
    avgOrderValue: number;
    byStatus: StatusBreakdown[];
  };
  dailyBreakdown: DailyBreakdown[];
  orders: ReportOrderRow[];
  lineItems: ReportLineItem[];
}

const STATUS_ORDER: OrderStatus[] = [
  "yeni",
  "hazirlaniyor",
  "kargoda",
  "teslim-edildi",
];

function formatTrDateTime(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatTrDate(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

export function buildSalesReport(
  orders: Order[],
  range: PeriodRange
): SalesReport {
  const filtered = orders
    .filter((o) => orderInRange(o.createdAt, range))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const lineItems: ReportLineItem[] = [];
  let unitsSold = 0;
  let subtotalSum = 0;
  let shippingSum = 0;
  let revenueSum = 0;

  const statusMap = new Map<OrderStatus, { count: number; revenue: number }>();
  for (const s of STATUS_ORDER) {
    statusMap.set(s, { count: 0, revenue: 0 });
  }

  const dailyMap = new Map<
    string,
    { orderCount: number; revenue: number; subtotal: number }
  >();

  const reportOrders: ReportOrderRow[] = filtered.map((order) => {
    const totals = resolveOrderTotals(order);
    subtotalSum += totals.subtotal;
    shippingSum += totals.shippingFee;
    revenueSum += totals.total;

    const st = statusMap.get(order.status)!;
    st.count += 1;
    st.revenue += totals.total;
    statusMap.set(order.status, st);

    const dayKey = formatTrDate(order.createdAt);
    const day = dailyMap.get(dayKey) ?? {
      orderCount: 0,
      revenue: 0,
      subtotal: 0,
    };
    day.orderCount += 1;
    day.revenue += totals.total;
    day.subtotal += totals.subtotal;
    dailyMap.set(dayKey, day);

    for (const item of order.items) {
      unitsSold += item.quantity;
      lineItems.push({
        orderId: order.id,
        orderDate: order.createdAt,
        orderDateLabel: formatTrDateTime(order.createdAt),
        customerName: order.customerName,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.price,
        lineTotal: item.price * item.quantity,
      });
    }

    return {
      id: order.id,
      createdAt: order.createdAt,
      createdAtLabel: formatTrDateTime(order.createdAt),
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      status: order.status,
      userEmail: order.userEmail,
      note: order.note,
      subtotal: totals.subtotal,
      shippingFee: totals.shippingFee,
      total: totals.total,
      itemCount: order.items.reduce((s, i) => s + i.quantity, 0),
      items: order.items,
    };
  });

  const dailyBreakdown: DailyBreakdown[] = [...dailyMap.entries()]
    .map(([date, v]) => ({
      date,
      dateLabel: date,
      orderCount: v.orderCount,
      revenue: v.revenue,
      subtotal: v.subtotal,
    }))
    .sort((a, b) => {
      const [da, ma, ya] = a.date.split(".").map(Number);
      const [db, mb, yb] = b.date.split(".").map(Number);
      return (
        new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime()
      );
    });

  const byStatus: StatusBreakdown[] = STATUS_ORDER.map((status) => ({
    status,
    count: statusMap.get(status)?.count ?? 0,
    revenue: statusMap.get(status)?.revenue ?? 0,
  }));

  const generatedAt = new Date().toISOString();

  return {
    range,
    generatedAt,
    generatedAtLabel: formatTrDateTime(generatedAt),
    summary: {
      orderCount: filtered.length,
      lineItemCount: lineItems.length,
      unitsSold,
      subtotal: Math.round(subtotalSum * 100) / 100,
      shippingTotal: Math.round(shippingSum * 100) / 100,
      revenue: Math.round(revenueSum * 100) / 100,
      avgOrderValue:
        filtered.length > 0
          ? Math.round((revenueSum / filtered.length) * 100) / 100
          : 0,
      byStatus,
    },
    dailyBreakdown,
    orders: reportOrders,
    lineItems,
  };
}

/** PDF / önizleme için para formatı (metin) */
export function moneyText(amount: number): string {
  return formatPrice(amount);
}
