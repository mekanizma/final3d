"use client";

import { useState } from "react";
import {
  FileText,
  ScanLine,
  Printer,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIntl } from "@/components/i18n/IntlProvider";
import { BillingReportPanel } from "@/components/admin/BillingReportPanel";
import { QuoteBuilderScan } from "@/components/admin/QuoteBuilderScan";
import { QuoteBuilderCustomPrint } from "@/components/admin/QuoteBuilderCustomPrint";

type BillingTab = "sales" | "scan" | "custom";

const TABS: { id: BillingTab; icon: typeof FileText; labelKey: string }[] = [
  { id: "sales", icon: TrendingUp, labelKey: "adminBilling.tabs.sales" },
  { id: "scan", icon: ScanLine, labelKey: "adminBilling.tabs.scan" },
  { id: "custom", icon: Printer, labelKey: "adminBilling.tabs.custom" },
];

export function BillingHub() {
  const { t } = useIntl();
  const [tab, setTab] = useState<BillingTab>("sales");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-7 h-7 text-cyan-400" aria-hidden />
          {t("adminBilling.title")}
        </h1>
        <p className="text-violet-200/60 text-sm mt-1">
          {t("adminBilling.hubSubtitle")}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 p-1 rounded-2xl glass border border-white/10">
        {TABS.map(({ id, icon: Icon, labelKey }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
              tab === id
                ? "bg-gradient-to-r from-fuchsia-500/30 to-cyan-500/20 text-white border border-fuchsia-400/40"
                : "text-violet-100/80 hover:text-white hover:bg-white/5"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden />
            {t(labelKey)}
          </button>
        ))}
      </div>

      {tab === "sales" && <BillingReportPanel embedded />}
      {tab === "scan" && <QuoteBuilderScan />}
      {tab === "custom" && <QuoteBuilderCustomPrint />}
    </div>
  );
}
