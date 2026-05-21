"use client";

import { useState } from "react";
import { Loader2, Printer, FileOutput } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { QuoteLineItemsEditor } from "@/components/admin/QuoteLineItemsEditor";
import { useIntl } from "@/components/i18n/IntlProvider";
import {
  addValidDays,
  emptyCustomPrintQuote,
  generateQuoteNo,
  type CustomPrintQuoteDocument,
} from "@/lib/billing/quoteTypes";
import { openQuotePdf } from "@/lib/billing/openQuotePdf";

const MATERIALS = ["pla", "abs", "petg", "tpu"] as const;

export function QuoteBuilderCustomPrint() {
  const { t } = useIntl();
  const [doc, setDoc] = useState<CustomPrintQuoteDocument>(emptyCustomPrintQuote);
  const [validDays, setValidDays] = useState(14);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function patch<K extends keyof CustomPrintQuoteDocument>(
    key: K,
    value: CustomPrintQuoteDocument[K]
  ) {
    setDoc((d) => ({ ...d, [key]: value }));
  }

  function patchClient(field: keyof CustomPrintQuoteDocument["client"], value: string) {
    setDoc((d) => ({
      ...d,
      client: { ...d.client, [field]: value },
    }));
  }

  function onIssuedChange(ymd: string) {
    setDoc((d) => ({
      ...d,
      issuedAt: ymd,
      validUntil: addValidDays(ymd, validDays),
    }));
  }

  function onValidDaysChange(days: number) {
    setValidDays(days);
    setDoc((d) => ({
      ...d,
      validUntil: addValidDays(d.issuedAt, days),
    }));
  }

  async function handleCreate() {
    setLoading(true);
    setError(null);
    try {
      await openQuotePdf("custom", doc);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Printer className="w-6 h-6 text-fuchsia-400" aria-hidden />
          {t("adminBilling.quote.customTitle")}
        </h2>
        <p className="text-sm text-violet-200/60 mt-1">
          {t("adminBilling.quote.customSubtitle")}
        </p>
      </div>

      <GlassCard hover={false} className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-violet-100/90">
          {t("adminBilling.quote.metaSection")}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="space-y-1">
            <span className="text-xs text-violet-300/60">
              {t("adminBilling.quote.quoteNo")}
            </span>
            <input
              className="input-field font-mono text-sm"
              value={doc.quoteNo}
              onChange={(e) => patch("quoteNo", e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs text-violet-300/60">
              {t("adminBilling.quote.issuedAt")}
            </span>
            <input
              type="date"
              className="input-field"
              value={doc.issuedAt}
              onChange={(e) => onIssuedChange(e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs text-violet-300/60">
              {t("adminBilling.quote.validDays")}
            </span>
            <input
              type="number"
              min={1}
              max={365}
              className="input-field"
              value={validDays}
              onChange={(e) => onValidDaysChange(Number(e.target.value) || 14)}
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs text-violet-300/60">
              {t("adminBilling.quote.validUntil")}
            </span>
            <input
              type="date"
              className="input-field"
              value={doc.validUntil}
              onChange={(e) => patch("validUntil", e.target.value)}
            />
          </label>
        </div>
        <button
          type="button"
          onClick={() =>
            setDoc((d) => ({ ...d, quoteNo: generateQuoteNo("custom") }))
          }
          className="text-xs text-cyan-300 hover:underline"
        >
          {t("adminBilling.quote.newQuoteNo")}
        </button>
      </GlassCard>

      <GlassCard hover={false} className="p-5 space-y-4">
        <h3 className="text-sm font-semibold">{t("adminBilling.quote.clientSection")}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            className="input-field"
            placeholder={t("adminBilling.quote.clientName")}
            value={doc.client.name}
            onChange={(e) => patchClient("name", e.target.value)}
          />
          <input
            className="input-field"
            placeholder={t("adminBilling.quote.clientPhone")}
            value={doc.client.phone}
            onChange={(e) => patchClient("phone", e.target.value)}
          />
          <input
            className="input-field sm:col-span-2"
            type="email"
            placeholder={t("adminBilling.quote.clientEmail")}
            value={doc.client.email}
            onChange={(e) => patchClient("email", e.target.value)}
          />
        </div>
      </GlassCard>

      <GlassCard hover={false} className="p-5 space-y-4">
        <h3 className="text-sm font-semibold">{t("adminBilling.quote.customDetails")}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <select
            className="input-field"
            value={doc.material}
            onChange={(e) =>
              patch("material", e.target.value as CustomPrintQuoteDocument["material"])
            }
          >
            {MATERIALS.map((m) => (
              <option key={m} value={m}>
                {t(`printMaterial.${m}.label`)}
              </option>
            ))}
          </select>
          <input
            className="input-field"
            placeholder={t("adminBilling.quote.colorPh")}
            value={doc.color}
            onChange={(e) => patch("color", e.target.value)}
          />
          <input
            className="input-field"
            placeholder={t("adminBilling.quote.qtyPh")}
            value={doc.quantity}
            onChange={(e) => patch("quantity", e.target.value)}
          />
          <input
            className="input-field"
            placeholder={t("adminBilling.quote.filePh")}
            value={doc.fileName}
            onChange={(e) => patch("fileName", e.target.value)}
          />
        </div>
        <textarea
          className="input-field min-h-[60px] resize-none"
          placeholder={t("adminBilling.quote.clientNotePh")}
          value={doc.clientNote}
          onChange={(e) => patch("clientNote", e.target.value)}
        />
      </GlassCard>

      <GlassCard hover={false} className="p-5">
        <QuoteLineItemsEditor
          items={doc.lineItems}
          onChange={(lineItems) => patch("lineItems", lineItems)}
        />
      </GlassCard>

      <GlassCard hover={false} className="p-5 space-y-4">
        <label className="space-y-1 block">
          <span className="text-sm font-medium text-violet-100/90">
            {t("adminBilling.quote.adminNote")}
          </span>
          <textarea
            className="input-field min-h-[72px] resize-none"
            value={doc.adminNote}
            onChange={(e) => patch("adminNote", e.target.value)}
            placeholder={t("adminBilling.quote.adminNotePh")}
          />
        </label>
        <label className="space-y-1 block">
          <span className="text-sm font-medium text-violet-100/90">
            {t("adminBilling.quote.terms")}
          </span>
          <textarea
            className="input-field min-h-[120px] resize-y text-sm"
            value={doc.terms}
            onChange={(e) => patch("terms", e.target.value)}
          />
        </label>
      </GlassCard>

      {error && (
        <p className="text-sm text-rose-400 border border-rose-500/30 rounded-lg px-4 py-3 bg-rose-500/10">
          {error}
        </p>
      )}

      <NeonButton size="lg" onClick={() => void handleCreate()} disabled={loading}>
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <FileOutput className="w-5 h-5" />
        )}
        {t("adminBilling.quote.createBtn")}
      </NeonButton>
    </div>
  );
}
