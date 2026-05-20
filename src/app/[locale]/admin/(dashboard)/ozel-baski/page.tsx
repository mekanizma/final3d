"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { RequestStatusSelect } from "@/components/admin/RequestStatusSelect";
import { REQUEST_STATUS_COLORS, type RequestStatus } from "@/lib/constants";
import { useIntl } from "@/components/i18n/IntlProvider";
import { tFormat } from "@/lib/t-format";
import { formatDate } from "@/lib/utils";
import {
  getCustomPrintRequests,
  updateCustomPrintStatus,
  type CustomPrintRequest,
} from "@/services/customPrintService";

const REQUEST_STATUSES: RequestStatus[] = [
  "yeni",
  "inceleniyor",
  "teklif-gonderildi",
];

export default function AdminCustomPrintPage() {
  const { t } = useIntl();
  const [requests, setRequests] = useState<CustomPrintRequest[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<RequestStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await getCustomPrintRequests();
      setRequests(data);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 8000);
    return () => clearInterval(interval);
  }, []);

  async function handleStatusChange(id: string, status: RequestStatus) {
    const updated = await updateCustomPrintStatus(id, status);
    setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
  }

  const filtered = requests
    .filter((r) => filter === "all" || r.status === filter)
    .filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t("adminRequests.customTitle")}</h1>
        <p className="text-violet-200/60 text-sm">
          {loading
            ? t("adminRequests.countLoading")
            : tFormat(t, "adminRequests.count", {
                count: String(requests.length),
              })}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs ${
            filter === "all"
              ? "bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white"
              : "glass text-violet-100/80"
          }`}
        >
          {t("adminRequests.all")}
        </button>
        {REQUEST_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs ${
              filter === s
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
          placeholder={t("adminRequests.searchCustomPh")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((req) => (
            <motion.div key={req.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GlassCard className="p-4">
                <button
                  type="button"
                  className="w-full flex items-start justify-between gap-3 text-left"
                  onClick={() => setExpanded(expanded === req.id ? null : req.id)}
                >
                  <div>
                    <p className="font-medium">{req.name}</p>
                    <p className="text-xs text-violet-300/60 mt-0.5">
                      {req.email} · {formatDate(req.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full border ${REQUEST_STATUS_COLORS[req.status]}`}
                    >
                      {t(`requestStatus.${req.status}`)}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expanded === req.id ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {expanded === req.id && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3 text-sm">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <p>
                        <span className="text-violet-300/60">{t("adminRequests.phone")}:</span>{" "}
                        {req.phone}
                      </p>
                      <p>
                        <span className="text-violet-300/60">{t("adminRequests.material")}:</span>{" "}
                        {req.material.toUpperCase()}
                      </p>
                      <p>
                        <span className="text-violet-300/60">{t("adminRequests.color")}:</span>{" "}
                        {req.color}
                      </p>
                      <p>
                        <span className="text-violet-300/60">{t("adminRequests.qty")}:</span>{" "}
                        {req.quantity}
                      </p>
                      <p>
                        <span className="text-violet-300/60">{t("adminRequests.file")}:</span>{" "}
                        {req.fileName} (
                        {Math.round(req.fileSize / 1024)} KB)
                      </p>
                    </div>
                    {req.note && (
                      <p className="text-violet-200/80">
                        <span className="text-violet-300/60">{t("adminRequests.note")}:</span>{" "}
                        {req.note}
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-violet-300/60">
                        {t("adminRequests.status")}:
                      </span>
                      <RequestStatusSelect
                        value={req.status}
                        onChange={(s) => void handleStatusChange(req.id, s)}
                      />
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
        {!loading && filtered.length === 0 && (
          <p className="text-center text-violet-300/50 py-12">{t("adminRequests.notFound")}</p>
        )}
      </div>
    </div>
  );
}
