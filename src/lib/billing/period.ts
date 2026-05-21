export type BillingPeriod = "daily" | "weekly" | "monthly" | "yearly" | "custom";

export interface PeriodQuery {
  period: BillingPeriod;
  date?: string;
  month?: string;
  year?: string;
  from?: string;
  to?: string;
}

export interface PeriodRange {
  period: BillingPeriod;
  label: string;
  start: Date;
  end: Date;
  startIso: string;
  endIso: string;
}

const TZ = "Europe/Istanbul";

function parseYmd(s: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

/** Yerel (TR) takvim günü başı/sonu — UTC offset ile */
function dayBoundsInTz(y: number, month: number, d: number): { start: Date; end: Date } {
  const start = new Date(Date.UTC(y, month - 1, d, -3, 0, 0, 0));
  const end = new Date(Date.UTC(y, month - 1, d, 20, 59, 59, 999));
  return { start, end };
}

function todayParts(): { y: number; m: number; d: number } {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(new Date());
  const y = Number(parts.find((p) => p.type === "year")?.value);
  const m = Number(parts.find((p) => p.type === "month")?.value);
  const d = Number(parts.find((p) => p.type === "day")?.value);
  return { y, m, d };
}

function formatLabelTr(start: Date, end: Date, prefix: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    timeZone: TZ,
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const a = start.toLocaleDateString("tr-TR", opts);
  const b = end.toLocaleDateString("tr-TR", opts);
  return a === b ? `${prefix} — ${a}` : `${prefix} — ${a} – ${b}`;
}

export function resolvePeriodRange(query: PeriodQuery): PeriodRange {
  const { period } = query;

  if (period === "daily") {
    const p = query.date ? parseYmd(query.date) : todayParts();
    if (!p) throw new Error("Geçersiz tarih (YYYY-MM-DD).");
    const { start, end } = dayBoundsInTz(p.y, p.m, p.d);
    return {
      period,
      label: formatLabelTr(start, end, "Günlük rapor"),
      start,
      end,
      startIso: start.toISOString(),
      endIso: end.toISOString(),
    };
  }

  if (period === "weekly") {
    const anchor = query.date ? parseYmd(query.date) : todayParts();
    if (!anchor) throw new Error("Geçersiz tarih.");
    const anchorDate = new Date(anchor.y, anchor.m - 1, anchor.d);
    const dow = anchorDate.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    const mon = new Date(anchorDate);
    mon.setDate(anchorDate.getDate() + mondayOffset);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    const { start } = dayBoundsInTz(mon.getFullYear(), mon.getMonth() + 1, mon.getDate());
    const { end } = dayBoundsInTz(sun.getFullYear(), sun.getMonth() + 1, sun.getDate());
    return {
      period,
      label: formatLabelTr(start, end, "Haftalık rapor"),
      start,
      end,
      startIso: start.toISOString(),
      endIso: end.toISOString(),
    };
  }

  if (period === "monthly") {
    const monthStr = query.month ?? `${todayParts().y}-${String(todayParts().m).padStart(2, "0")}`;
    const m = /^(\d{4})-(\d{2})$/.exec(monthStr.trim());
    if (!m) throw new Error("Geçersiz ay (YYYY-MM).");
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const { start } = dayBoundsInTz(y, mo, 1);
    const lastDay = new Date(y, mo, 0).getDate();
    const { end } = dayBoundsInTz(y, mo, lastDay);
    const monthLabel = new Date(y, mo - 1, 1).toLocaleDateString("tr-TR", {
      month: "long",
      year: "numeric",
    });
    return {
      period,
      label: `Aylık rapor — ${monthLabel}`,
      start,
      end,
      startIso: start.toISOString(),
      endIso: end.toISOString(),
    };
  }

  if (period === "yearly") {
    const y = Number(query.year ?? todayParts().y);
    if (!Number.isFinite(y) || y < 2000) throw new Error("Geçersiz yıl.");
    const { start } = dayBoundsInTz(y, 1, 1);
    const { end } = dayBoundsInTz(y, 12, 31);
    return {
      period,
      label: `Yıllık rapor — ${y}`,
      start,
      end,
      startIso: start.toISOString(),
      endIso: end.toISOString(),
    };
  }

  const fromP = query.from ? parseYmd(query.from) : null;
  const toP = query.to ? parseYmd(query.to) : null;
  if (!fromP || !toP) throw new Error("Özel aralık için başlangıç ve bitiş tarihi gerekli.");
  const { start } = dayBoundsInTz(fromP.y, fromP.m, fromP.d);
  const { end } = dayBoundsInTz(toP.y, toP.m, toP.d);
  if (start > end) throw new Error("Başlangıç tarihi bitişten sonra olamaz.");
  return {
    period: "custom",
    label: formatLabelTr(start, end, "Özel dönem"),
    start,
    end,
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}

export function orderInRange(createdAt: string, range: PeriodRange): boolean {
  const t = new Date(createdAt).getTime();
  return t >= range.start.getTime() && t <= range.end.getTime();
}
