"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  TrendingUp,
  Package,
  ShoppingBag,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { useIntl } from "@/components/i18n/IntlProvider";
import { tFormat } from "@/lib/t-format";
import { formatPrice, cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { orderStatusLabel } from "@/lib/order-labels";
import type { SalesReport } from "@/lib/billing/buildReport";
import type { BillingPeriod } from "@/lib/billing/period";
import {
  downloadBlob,
  filenameFromDisposition,
} from "@/lib/downloadBlob";

const PERIODS: BillingPeriod[] = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "custom",
];

function todayYmd(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
  }).format(new Date());
}

function currentMonth(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function currentYear(): string {
  return String(new Date().getFullYear());
}

function buildReportQuery(
  period: BillingPeriod,
  opts: {
    date: string;
    month: string;
    year: string;
    from: string;
    to: string;
  }
): string {
  const p = new URLSearchParams({ period });
  if (period === "daily" || period === "weekly") p.set("date", opts.date);
  if (period === "monthly") p.set("month", opts.month);
  if (period === "yearly") p.set("year", opts.year);
  if (period === "custom") {
    p.set("from", opts.from);
    p.set("to", opts.to);
  }
  return p.toString();
}

export function BillingReportPanel({ embedded = false }: { embedded?: boolean }) {
  const { t } = useIntl();
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const [date, setDate] = useState(todayYmd);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [from, setFrom] = useState(todayYmd);
  const [to, setTo] = useState(todayYmd);
  const [report, setReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(
    () => buildReportQuery(period, { date, month, year, from, to }),
    [period, date, month, year, from, to]
  );

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/billing/report?${query}`, {
        credentials: "include",
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || res.statusText);
      setReport(body as SalesReport);
    } catch (e) {
      setError((e as Error).message);
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  async function downloadPdf() {
    setPdfLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/billing/report?${query}&format=pdf`,
        { credentials: "include" }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error || res.statusText);
      }
      const blob = await res.blob();
      if (!blob.size) {
        throw new Error("Boş PDF yanıtı alındı.");
      }
      const filename = filenameFromDisposition(
        res.headers.get("Content-Disposition"),
        `final3d-satis-${period}.pdf`
      );
      downloadBlob(blob, filename);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPdfLoading(false);
    }
  }

  const summary = report?.summary;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        {!embedded && (
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-7 h-7 text-cyan-400" aria-hidden />
              {t("adminBilling.title")}
            </h1>
            <p className="text-violet-200/60 text-sm mt-1">
              {t("adminBilling.subtitle")}
            </p>
          </div>
        )}
        {embedded && (
          <div>
            <h2 className="text-xl font-bold">{t("adminBilling.tabs.sales")}</h2>
            <p className="text-violet-200/60 text-sm mt-1">
              {t("adminBilling.subtitle")}
            </p>
          </div>
        )}
        <div className="flex flex-wrap gap-2 ml-auto">
          <NeonButton
            variant="ghost"
            onClick={() => void loadReport()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {t("adminBilling.refresh")}
          </NeonButton>
          <NeonButton onClick={() => void downloadPdf()} disabled={pdfLoading}>
            {pdfLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {t("adminBilling.downloadPdf")}
          </NeonButton>
        </div>
      </div>

      <GlassCard hover={false} className="p-5 space-y-4">
        <p className="text-sm font-medium text-violet-100/90">
          {t("adminBilling.periodLabel")}
        </p>
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                period === p
                  ? "bg-gradient-to-r from-fuchsia-500/30 to-cyan-500/20 border border-fuchsia-400/40 text-white"
                  : "glass text-violet-100/80 hover:text-white"
              )}
            >
              {t(`adminBilling.period.${p}`)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          {(period === "daily" || period === "weekly") && (
            <label className="space-y-1">
              <span className="text-xs text-violet-300/60 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" aria-hidden />
                {period === "daily"
                  ? t("adminBilling.pickDay")
                  : t("adminBilling.pickWeek")}
              </span>
              <input
                type="date"
                className="input-field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
          )}
          {period === "monthly" && (
            <label className="space-y-1">
              <span className="text-xs text-violet-300/60">
                {t("adminBilling.pickMonth")}
              </span>
              <input
                type="month"
                className="input-field"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </label>
          )}
          {period === "yearly" && (
            <label className="space-y-1">
              <span className="text-xs text-violet-300/60">
                {t("adminBilling.pickYear")}
              </span>
              <input
                type="number"
                className="input-field w-28"
                min={2020}
                max={2100}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </label>
          )}
          {period === "custom" && (
            <>
              <label className="space-y-1">
                <span className="text-xs text-violet-300/60">
                  {t("adminBilling.from")}
                </span>
                <input
                  type="date"
                  className="input-field"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-violet-300/60">
                  {t("adminBilling.to")}
                </span>
                <input
                  type="date"
                  className="input-field"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </label>
            </>
          )}
          <NeonButton onClick={() => void loadReport()} disabled={loading}>
            {t("adminBilling.apply")}
          </NeonButton>
        </div>

        {report && (
          <p className="text-xs text-cyan-300/80 border border-cyan-400/20 rounded-lg px-3 py-2 bg-cyan-500/5">
            {report.range.label}
          </p>
        )}
      </GlassCard>

      {error && (
        <p className="text-sm text-rose-400 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3">
          {error}
        </p>
      )}

      {loading && !report && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
        </div>
      )}

      {summary && report && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              {
                label: t("adminBilling.kpiOrders"),
                value: String(summary.orderCount),
                icon: ShoppingBag,
                color: "from-purple-500 to-pink-500",
              },
              {
                label: t("adminBilling.kpiRevenue"),
                value: formatPrice(summary.revenue),
                icon: TrendingUp,
                color: "from-emerald-500 to-teal-500",
              },
              {
                label: t("adminBilling.kpiSubtotal"),
                value: formatPrice(summary.subtotal),
                icon: Package,
                color: "from-blue-500 to-cyan-500",
              },
              {
                label: t("adminBilling.kpiAvg"),
                value: formatPrice(summary.avgOrderValue),
                icon: FileText,
                color: "from-amber-500 to-orange-500",
              },
            ].map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard hover={false} className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center",
                          kpi.color
                        )}
                      >
                        <Icon className="w-5 h-5 text-white" aria-hidden />
                      </div>
                    </div>
                    <p className="text-xs text-violet-200/60">{kpi.label}</p>
                    <p className="text-xl font-bold text-neon mt-1">
                      {kpi.value}
                    </p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <GlassCard hover={false} className="p-5">
              <h2 className="font-semibold mb-4">{t("adminBilling.byStatus")}</h2>
              <div className="space-y-2">
                {summary.byStatus.map((row) => (
                  <div
                    key={row.status}
                    className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0"
                  >
                    <span className="text-violet-200/80">
                      {orderStatusLabel(row.status, t)}
                    </span>
                    <span>
                      {row.count} · {formatPrice(row.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard hover={false} className="p-5">
              <h2 className="font-semibold mb-4">{t("adminBilling.daily")}</h2>
              {report.dailyBreakdown.length === 0 ? (
                <p className="text-sm text-violet-200/50">
                  {t("adminBilling.noData")}
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {report.dailyBreakdown.map((d) => (
                    <div
                      key={d.date}
                      className="flex justify-between text-sm py-2 border-b border-white/5"
                    >
                      <span>{d.dateLabel}</span>
                      <span>
                        {d.orderCount} {t("adminBilling.ordersShort")} ·{" "}
                        {formatPrice(d.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          <GlassCard hover={false} className="p-5 overflow-x-auto">
            <h2 className="font-semibold mb-4">
              {tFormat(t, "adminBilling.ordersTable", {
                count: String(report.orders.length),
              })}
            </h2>
            {report.orders.length === 0 ? (
              <p className="text-sm text-violet-200/50">
                {t("adminBilling.noOrders")}
              </p>
            ) : (
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="text-left text-violet-300/70 border-b border-white/10">
                    <th className="py-2 pr-3">{t("adminBilling.colDate")}</th>
                    <th className="py-2 pr-3">{t("adminBilling.colId")}</th>
                    <th className="py-2 pr-3">{t("adminBilling.colCustomer")}</th>
                    <th className="py-2 pr-3">{t("adminBilling.colStatus")}</th>
                    <th className="py-2 pr-3 text-right">
                      {t("adminBilling.colTotal")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.orders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-b border-white/5 hover:bg-white/[0.03]"
                    >
                      <td className="py-2.5 pr-3 whitespace-nowrap">
                        {o.createdAtLabel}
                      </td>
                      <td className="py-2.5 pr-3 font-mono text-xs">
                        {o.id}
                      </td>
                      <td className="py-2.5 pr-3">{o.customerName}</td>
                      <td className="py-2.5 pr-3">
                        {ORDER_STATUS_LABELS[o.status]}
                      </td>
                      <td className="py-2.5 text-right font-medium text-neon">
                        {formatPrice(o.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </GlassCard>
        </>
      )}
    </div>
  );
}
