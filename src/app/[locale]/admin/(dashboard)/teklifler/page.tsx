"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Printer, ScanLine } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { RequestStatusSelect } from "@/components/admin/RequestStatusSelect";
import { QuoteAttachmentView } from "@/components/admin/QuoteAttachmentView";
import { REQUEST_STATUS_COLORS, type RequestStatus } from "@/lib/constants";
import { useIntl } from "@/components/i18n/IntlProvider";
import { tFormat } from "@/lib/t-format";
import { formatDate } from "@/lib/utils";
import type { CustomPrintRequest } from "@/services/customPrintService";
import type { ScanQuoteRequest } from "@/services/scanRequestService";
import {
  getAdminQuotes,
  updateCustomPrintStatus,
  updateScanQuoteStatus,
  type QuoteKind,
} from "@/services/quoteService";

const REQUEST_STATUSES: RequestStatus[] = [
  "yeni",
  "inceleniyor",
  "teklif-gonderildi",
];

type TabFilter = "all" | QuoteKind;

type QuoteRow =
  | { kind: "custom"; data: CustomPrintRequest }
  | { kind: "scan"; data: ScanQuoteRequest };

export default function AdminQuotesPage() {
  const { t } = useIntl();
  const [custom, setCustom] = useState<CustomPrintRequest[]>([]);
  const [scan, setScan] = useState<ScanQuoteRequest[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<TabFilter>("all");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await getAdminQuotes();
      setCustom(data.custom);
      setScan(data.scan);
    } catch {
      setCustom([]);
      setScan([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 8000);
    return () => clearInterval(interval);
  }, []);

  const rows = useMemo<QuoteRow[]>(() => {
    const list: QuoteRow[] = [
      ...custom.map((data) => ({ kind: "custom" as const, data })),
      ...scan.map((data) => ({ kind: "scan" as const, data })),
    ];
    list.sort(
      (a, b) =>
        new Date(b.data.createdAt).getTime() -
        new Date(a.data.createdAt).getTime()
    );
    return list;
  }, [custom, scan]);

  const totalCount = custom.length + scan.length;

  async function handleStatusChange(
    kind: QuoteKind,
    id: string,
    status: RequestStatus
  ) {
    if (kind === "custom") {
      const updated = await updateCustomPrintStatus(id, status);
      setCustom((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } else {
      const updated = await updateScanQuoteStatus(id, status);
      setScan((prev) => prev.map((r) => (r.id === id ? updated : r)));
    }
  }

  const filtered = rows
    .filter((r) => tab === "all" || r.kind === tab)
    .filter((r) => statusFilter === "all" || r.data.status === statusFilter)
    .filter((r) => {
      const q = search.toLowerCase();
      const d = r.data;
      return (
        d.name.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        ("city" in d && d.city.toLowerCase().includes(q))
      );
    });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t("adminQuotes.title")}</h1>
        <p className="text-violet-200/60 text-sm">
          {loading
            ? t("adminRequests.countLoading")
            : tFormat(t, "adminQuotes.countSummary", {
                total: String(totalCount),
                custom: String(custom.length),
                scan: String(scan.length),
              })}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(
          [
            ["all", t("adminQuotes.tabAll")],
            ["custom", t("adminQuotes.tabCustom")],
            ["scan", t("adminQuotes.tabScan")],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`px-3 py-1.5 rounded-full text-xs ${
              tab === value
                ? "bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white"
                : "glass text-violet-100/80"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs ${
            statusFilter === "all"
              ? "bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white"
              : "glass text-violet-100/80"
          }`}
        >
          {t("adminRequests.all")}
        </button>
        {REQUEST_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs ${
              statusFilter === s
                ? "bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white"
                : "glass text-violet-100/80"
            }`}
          >
            {t(`requestStatus.${s}`)}
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-300/70" />
        <input
          className="input-field pl-10"
          placeholder={t("adminQuotes.searchPh")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((row) => {
            const req = row.data;
            const rowKey = `${row.kind}-${req.id}`;
            const isOpen = expanded === rowKey;
            const KindIcon = row.kind === "custom" ? Printer : ScanLine;

            return (
              <motion.div
                key={rowKey}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <GlassCard className="p-4">
                  <button
                    type="button"
                    className="w-full flex items-start justify-between gap-3 text-left"
                    onClick={() => setExpanded(isOpen ? null : rowKey)}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${
                            row.kind === "custom"
                              ? "border-fuchsia-400/40 text-fuchsia-200"
                              : "border-cyan-400/40 text-cyan-200"
                          }`}
                        >
                          <KindIcon className="w-3 h-3" />
                          {row.kind === "custom"
                            ? t("adminQuotes.badgeCustom")
                            : t("adminQuotes.badgeScan")}
                        </span>
                        <p className="font-medium truncate">{req.name}</p>
                      </div>
                      <p className="text-xs text-violet-300/60 mt-0.5">
                        {req.email}
                        {row.kind === "scan" && ` · ${row.data.city}`} ·{" "}
                        {formatDate(req.createdAt)} · {req.id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] px-2 py-1 rounded-full border ${REQUEST_STATUS_COLORS[req.status]}`}
                      >
                        {t(`requestStatus.${req.status}`)}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-4 text-sm">
                      {row.kind === "custom" ? (
                        <CustomDetail req={row.data} />
                      ) : (
                        <ScanDetail req={row.data} />
                      )}

                      <div className="flex items-center gap-3 pt-2">
                        <span className="text-xs text-violet-300/60">
                          {t("adminRequests.status")}:
                        </span>
                        <RequestStatusSelect
                          value={req.status}
                          onChange={(s) =>
                            void handleStatusChange(row.kind, req.id, s)
                          }
                        />
                      </div>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {!loading && filtered.length === 0 && (
          <p className="text-center text-violet-300/50 py-12">
            {t("adminRequests.notFound")}
          </p>
        )}
      </div>
    </div>
  );
}

function CustomDetail({ req }: { req: CustomPrintRequest }) {
  const { t } = useIntl();
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-3">
        <DetailField label={t("adminRequests.phone")} value={req.phone} />
        <DetailField
          label={t("adminRequests.material")}
          value={req.material.toUpperCase()}
        />
        <DetailField label={t("adminRequests.color")} value={req.color} />
        <DetailField label={t("adminRequests.qty")} value={req.quantity} />
        <DetailField
          label={t("adminRequests.file")}
          value={`${req.fileName} (${Math.round(req.fileSize / 1024)} KB)`}
        />
        <DetailField label={t("adminQuotes.requestId")} value={req.id} />
      </div>
      {req.note && (
        <DetailField label={t("adminRequests.note")} value={req.note} block />
      )}
      <QuoteAttachmentView
        kind="custom"
        id={req.id}
        hasStorage={Boolean(req.fileStoragePath)}
        fileLabel={t("adminRequests.file")}
      />
    </>
  );
}

function ScanDetail({ req }: { req: ScanQuoteRequest }) {
  const { t } = useIntl();
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-3">
        <DetailField label={t("adminRequests.phone")} value={req.phone} />
        <DetailField label={t("adminRequests.qty")} value={req.quantity} />
        <DetailField
          label={t("adminRequests.object")}
          value={req.objectDescription}
          span
        />
        <DetailField label={t("adminRequests.scanArea")} value={req.scanArea} />
        <DetailField
          label={t("adminRequests.location")}
          value={`${t(`scanLocation.${req.locationType}`)} — ${req.locationAddress}`}
        />
        <DetailField label={t("adminQuotes.city")} value={req.city} />
        <DetailField
          label={t("adminRequests.purpose")}
          value={t(`scanPurpose.${req.purpose}`)}
        />
        <DetailField
          label={t("adminRequests.surface")}
          value={t(`scanSurface.${req.surfaceType}`)}
        />
        <DetailField
          label={t("adminRequests.wantsPrint")}
          value={
            req.wantsPrint ? t("adminRequests.yes") : t("adminRequests.no")
          }
        />
        {req.photoFileName && (
          <DetailField
            label={t("adminRequests.photo")}
            value={`${req.photoFileName}${
              req.photoFileSize
                ? ` (${Math.round(req.photoFileSize / 1024)} KB)`
                : ""
            }`}
          />
        )}
        <DetailField label={t("adminQuotes.requestId")} value={req.id} />
      </div>
      {req.note && (
        <DetailField label={t("adminRequests.note")} value={req.note} block />
      )}
      {(req.photoFileName || req.photoStoragePath) && (
        <QuoteAttachmentView
          kind="scan"
          id={req.id}
          hasStorage={Boolean(req.photoStoragePath)}
          fileLabel={t("adminRequests.photo")}
        />
      )}
    </>
  );
}

function DetailField({
  label,
  value,
  span,
  block,
}: {
  label: string;
  value: string;
  span?: boolean;
  block?: boolean;
}) {
  if (block) {
    return (
      <p className="text-violet-200/80">
        <span className="text-violet-300/60">{label}:</span> {value}
      </p>
    );
  }
  return (
    <p className={span ? "sm:col-span-2" : undefined}>
      <span className="text-violet-300/60">{label}:</span> {value}
    </p>
  );
}
