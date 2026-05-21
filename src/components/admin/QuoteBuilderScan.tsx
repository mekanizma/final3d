"use client";

import { useState } from "react";
import { Loader2, ScanLine, FileOutput } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { QuoteLineItemsEditor } from "@/components/admin/QuoteLineItemsEditor";
import { useIntl } from "@/components/i18n/IntlProvider";
import {
  SCAN_LOCATIONS,
  SCAN_PURPOSES,
  SCAN_SURFACE_TYPES,
  type ScanLocationId,
  type ScanPurposeId,
  type ScanSurfaceId,
} from "@/lib/scanQuoteOptions";
import {
  addValidDays,
  emptyScanQuote,
  generateQuoteNo,
  type ScanQuoteDocument,
} from "@/lib/billing/quoteTypes";
import { openQuotePdf } from "@/lib/billing/openQuotePdf";

export function QuoteBuilderScan() {
  const { t } = useIntl();
  const [doc, setDoc] = useState<ScanQuoteDocument>(emptyScanQuote);
  const [validDays, setValidDays] = useState(14);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function patch<K extends keyof ScanQuoteDocument>(
    key: K,
    value: ScanQuoteDocument[K]
  ) {
    setDoc((d) => ({ ...d, [key]: value }));
  }

  function patchClient(field: keyof ScanQuoteDocument["client"], value: string) {
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
      await openQuotePdf("scan", doc);
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
          <ScanLine className="w-6 h-6 text-cyan-400" aria-hidden />
          {t("adminBilling.quote.scanTitle")}
        </h2>
        <p className="text-sm text-violet-200/60 mt-1">
          {t("adminBilling.quote.scanSubtitle")}
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
            setDoc((d) => ({ ...d, quoteNo: generateQuoteNo("scan") }))
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
            placeholder={t("adminBilling.quote.clientCompany")}
            value={doc.client.company ?? ""}
            onChange={(e) => patchClient("company", e.target.value)}
          />
          <input
            className="input-field"
            placeholder={t("adminBilling.quote.clientPhone")}
            value={doc.client.phone}
            onChange={(e) => patchClient("phone", e.target.value)}
          />
          <input
            className="input-field"
            type="email"
            placeholder={t("adminBilling.quote.clientEmail")}
            value={doc.client.email}
            onChange={(e) => patchClient("email", e.target.value)}
          />
        </div>
      </GlassCard>

      <GlassCard hover={false} className="p-5 space-y-4">
        <h3 className="text-sm font-semibold">{t("adminBilling.quote.scanDetails")}</h3>
        <textarea
          className="input-field min-h-[80px] resize-none"
          placeholder={t("scanForm.objectPh")}
          value={doc.objectDescription}
          onChange={(e) => patch("objectDescription", e.target.value)}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            className="input-field"
            placeholder={t("scanForm.scanAreaPh")}
            value={doc.scanArea}
            onChange={(e) => patch("scanArea", e.target.value)}
          />
          <input
            className="input-field"
            placeholder={t("scanForm.qtyPh")}
            value={doc.quantity}
            onChange={(e) => patch("quantity", e.target.value)}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <select
            className="input-field"
            value={doc.locationType}
            onChange={(e) =>
              patch("locationType", e.target.value as ScanLocationId)
            }
          >
            {SCAN_LOCATIONS.map((l) => (
              <option key={l.id} value={l.id}>
                {t(`scanLocation.${l.id}`)}
              </option>
            ))}
          </select>
          <input
            className="input-field"
            placeholder={t("scanForm.cityPh")}
            value={doc.city}
            onChange={(e) => patch("city", e.target.value)}
          />
        </div>
        {doc.locationType === "onsite" && (
          <input
            className="input-field"
            placeholder={t("scanForm.addressOnsite")}
            value={doc.locationAddress}
            onChange={(e) => patch("locationAddress", e.target.value)}
          />
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <select
            className="input-field"
            value={doc.purpose}
            onChange={(e) => patch("purpose", e.target.value as ScanPurposeId)}
          >
            {SCAN_PURPOSES.map((p) => (
              <option key={p.id} value={p.id}>
                {t(`scanPurpose.${p.id}`)}
              </option>
            ))}
          </select>
          <select
            className="input-field"
            value={doc.surfaceType}
            onChange={(e) =>
              patch("surfaceType", e.target.value as ScanSurfaceId)
            }
          >
            {SCAN_SURFACE_TYPES.map((s) => (
              <option key={s.id} value={s.id}>
                {t(`scanSurface.${s.id}`)}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-violet-200/70 cursor-pointer">
          <input
            type="checkbox"
            checked={doc.wantsPrint}
            onChange={(e) => patch("wantsPrint", e.target.checked)}
            className="rounded"
          />
          {t("scanForm.wantsPrintLong")}
        </label>
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
