"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ScanLine,
  Copy,
  RotateCcw,
  Info,
  Sparkles,
  FileOutput,
  MessageCircle,
  Mail,
  Loader2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { ScanPricingSettingsPanel } from "@/components/admin/ScanPricingSettingsPanel";
import { formatPrice, cn } from "@/lib/utils";
import { getLocaleFromPathname, withLocale } from "@/lib/locale-path";
import { openQuotePdf } from "@/lib/billing/openQuotePdf";
import { openWhatsAppWithMessage } from "@/lib/whatsapp/openWhatsApp";
import {
  DEFAULT_SCAN_PRICING_CONFIG,
  type ScanPricingConfig,
} from "@/lib/scanPricingConfig";
import {
  buildScanQuoteFromPricing,
  buildCustomerMailto,
  formatCustomerOfferMessage,
  saveScanPricingQuoteDraft,
} from "@/lib/scanPricingToQuote";
import {
  SCAN_PRICING_DEFAULTS,
  calculateScanPricing,
  formatScanPricingReport,
  type ScanPricingInputs,
  type ScanWorkType,
  type ScanObjectSize,
  type ScanDetailLevel,
  type ScanUrgency,
  type ScanFileStatus,
  type ScanCustomerType,
} from "@/lib/scanPricingCalculator";

const workTypes: { value: ScanWorkType; label: string }[] = [
  { value: "scan", label: "3D tarama" },
  { value: "modeling", label: "3D modelleme" },
  { value: "reverse", label: "Reverse engineering" },
  { value: "print", label: "3D baskı hizmeti" },
];

const sizes: { value: ScanObjectSize; label: string }[] = [
  { value: "small", label: "Küçük" },
  { value: "medium", label: "Orta" },
  { value: "large", label: "Büyük" },
];

const details: { value: ScanDetailLevel; label: string }[] = [
  { value: "low", label: "Düşük" },
  { value: "medium", label: "Orta" },
  { value: "high", label: "Yüksek" },
];

const urgencies: { value: ScanUrgency; label: string }[] = [
  { value: "normal", label: "Normal (×1)" },
  { value: "fast", label: "Hızlı teslim (×1,3)" },
  { value: "urgent", label: "Acil teslim (×1,7)" },
];

const fileStatuses: { value: ScanFileStatus; label: string }[] = [
  { value: "reference_yes", label: "Referans / dosya var" },
  { value: "reference_no", label: "Referans yok" },
  { value: "broken_part", label: "Kırık parça" },
  { value: "has_dimensions", label: "Ölçü / teknik resim var" },
];

const customers: { value: ScanCustomerType; label: string }[] = [
  { value: "individual", label: "Bireysel" },
  { value: "corporate", label: "Kurumsal (×1,2)" },
  { value: "industrial", label: "Endüstriyel" },
];

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-violet-200/70 mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full px-3 py-2.5 rounded-xl glass border border-white/10 bg-violet-950/30 text-white text-sm focus:outline-none focus:border-cyan-400/40"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-violet-950">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ScanPricingRobot() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);

  const [inputs, setInputs] = useState<ScanPricingInputs>({
    ...SCAN_PRICING_DEFAULTS,
  });
  const [config, setConfig] = useState<ScanPricingConfig>({
    ...DEFAULT_SCAN_PRICING_CONFIG,
  });
  const [copied, setCopied] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleConfigChange = useCallback((c: ScanPricingConfig) => {
    setConfig(c);
  }, []);

  const result = useMemo(
    () => calculateScanPricing(inputs, config),
    [inputs, config]
  );

  const customerMessage = useMemo(
    () => formatCustomerOfferMessage(inputs, result, clientName),
    [inputs, result, clientName]
  );

  function patch<K extends keyof ScanPricingInputs>(
    key: K,
    value: ScanPricingInputs[K]
  ) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setInputs({ ...SCAN_PRICING_DEFAULTS });
  }

  async function copyReport() {
    await navigator.clipboard.writeText(
      formatScanPricingReport(inputs, result)
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function transferToQuote() {
    saveScanPricingQuoteDraft({
      inputs,
      breakdown: result,
      createdAt: new Date().toISOString(),
    });
    router.push(withLocale("/admin/faturalandirma?tab=scan", locale));
  }

  async function exportCustomerPdf() {
    setExportError(null);
    if (!clientName.trim()) {
      setExportError("PDF için müşteri adı girin.");
      return;
    }
    if (!clientPhone.trim() && !clientEmail.trim()) {
      setExportError("PDF için telefon veya e-posta girin.");
      return;
    }
    setPdfLoading(true);
    try {
      const doc = buildScanQuoteFromPricing(inputs, result);
      doc.client = {
        name: clientName.trim(),
        phone: clientPhone.trim(),
        email: clientEmail.trim(),
        company: doc.client.company,
      };
      await openQuotePdf("scan", doc);
    } catch (e) {
      setExportError((e as Error).message);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/20 border border-white/10 flex items-center justify-center">
            <ScanLine className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">3D Tarama Fiyat Robotu</h1>
            <p className="text-sm text-violet-200/60">
              Tarama, modelleme, RE ve baskı için piyasa uyumlu teklif aralığı
            </p>
          </div>
        </div>
        <p className="text-xs text-violet-300/45 flex items-start gap-2 mt-3 max-w-2xl">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          Tablolar admin panelden düzenlenebilir. Müşteriye göndermeden önce
          projeyi doğrulayın.
        </p>
      </div>

      <ScanPricingSettingsPanel onConfigChange={handleConfigChange} />

      <div className="grid lg:grid-cols-5 gap-6">
        <GlassCard hover={false} className="lg:col-span-2 p-6 border-white/10">
          <h2 className="text-sm font-semibold text-violet-200/80 mb-5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            Proje bilgileri
          </h2>
          <div className="space-y-4">
            <SelectField
              label="İş tipi"
              value={inputs.workType}
              options={workTypes}
              onChange={(v) => patch("workType", v)}
            />
            <SelectField
              label="Obje boyutu"
              value={inputs.objectSize}
              options={sizes}
              onChange={(v) => patch("objectSize", v)}
            />
            <SelectField
              label="Detay seviyesi"
              value={inputs.detailLevel}
              options={details}
              onChange={(v) => patch("detailLevel", v)}
            />
            <SelectField
              label="Aciliyet"
              value={inputs.urgency}
              options={urgencies}
              onChange={(v) => patch("urgency", v)}
            />
            <SelectField
              label="Dosya durumu"
              value={inputs.fileStatus}
              options={fileStatuses}
              onChange={(v) => patch("fileStatus", v)}
            />
            <SelectField
              label="Müşteri tipi"
              value={inputs.customerType}
              options={customers}
              onChange={(v) => patch("customerType", v)}
            />
            <div>
              <label className="block text-xs font-medium text-violet-200/70 mb-1.5">
                Tahmini süre (saat, opsiyonel)
              </label>
              <input
                type="number"
                min={0}
                step={1}
                placeholder="Boş bırakılabilir"
                value={inputs.estimatedHours ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  patch(
                    "estimatedHours",
                    v === "" ? undefined : Math.max(0, Number(v))
                  );
                }}
                className="w-full px-3 py-2.5 rounded-xl glass border border-white/10 bg-violet-950/30 text-white text-sm focus:outline-none focus:border-cyan-400/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-violet-200/70 mb-1.5">
                Proje notu (opsiyonel)
              </label>
              <textarea
                rows={2}
                value={inputs.notes ?? ""}
                onChange={(e) =>
                  patch("notes", e.target.value || undefined)
                }
                placeholder="Örn. iki parça, yüzey hassasiyeti…"
                className="w-full px-3 py-2.5 rounded-xl glass border border-white/10 bg-violet-950/30 text-white text-sm focus:outline-none focus:border-cyan-400/40 resize-none"
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={transferToQuote}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm bg-gradient-to-r from-fuchsia-500/80 to-violet-600/80 text-white hover:opacity-90 transition-opacity"
              >
                <FileOutput className="w-4 h-4" />
                Teklife aktar (PDF oluştur)
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border border-white/10 text-violet-200/70 hover:bg-white/5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Sıfırla
                </button>
                <button
                  type="button"
                  onClick={() => void copyReport()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border border-cyan-400/30 text-cyan-200/90 hover:bg-cyan-500/10 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Kopyalandı" : "İç metin"}
                </button>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="lg:col-span-3 space-y-4">
          <GlassCard
            hover={false}
            className="p-6 border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-500/5 to-transparent"
          >
            <p className="text-xs uppercase tracking-wider text-violet-300/50 mb-1">
              Önerilen fiyat (pazarlık paylı)
            </p>
            <p className="text-4xl sm:text-5xl font-bold text-neon tabular-nums">
              {formatPrice(result.recommendedPrice)}
            </p>
            <p className="text-sm text-violet-200/60 mt-2">
              Aralık:{" "}
              <strong className="text-cyan-300/90">
                {formatPrice(result.minPrice)}
              </strong>
              {" – "}
              <strong className="text-cyan-300/90">
                {formatPrice(result.maxPrice)}
              </strong>
            </p>
          </GlassCard>

          <GlassCard hover={false} className="p-6 border-white/10 space-y-5">
            <section>
              <h3 className="text-xs font-semibold text-violet-300/60 uppercase tracking-wider mb-2">
                1. İş özeti
              </h3>
              <p className="text-sm text-white/90">{result.summary}</p>
              {inputs.notes?.trim() && (
                <p className="text-xs text-violet-300/55 mt-2">
                  Not: {inputs.notes.trim()}
                </p>
              )}
            </section>

            <section>
              <h3 className="text-xs font-semibold text-violet-300/60 uppercase tracking-wider mb-2">
                3. Fiyat kırılımı
              </h3>
              <ul className="space-y-2 text-sm">
                <BreakdownLine label="Tarama" value={result.scanPortion} />
                <BreakdownLine
                  label="Modelleme"
                  value={result.modelingPortion}
                />
                <BreakdownLine label="Düzenleme" value={result.editingPortion} />
                <BreakdownLine
                  label="Aciliyet / detay çarpanı"
                  value={result.multiplierDelta}
                  signed
                />
              </ul>
              <p className="text-[10px] text-violet-300/45 mt-3 font-mono">
                Detay ×{result.detailMultiplier} · Aciliyet ×
                {result.urgencyMultiplier} · Müşteri ×
                {result.customerMultiplier} · Dosya ×{result.fileMultiplier}
              </p>
            </section>

            <section>
              <h3 className="text-xs font-semibold text-violet-300/60 uppercase tracking-wider mb-2">
                4. Süre tahmini
              </h3>
              <p className="text-sm text-cyan-200/80">{result.durationLabel}</p>
            </section>

            <section className="border-t border-white/10 pt-4">
              <h3 className="text-xs font-semibold text-violet-300/60 uppercase tracking-wider mb-2">
                5. Kısa açıklama
              </h3>
              <p className="text-sm text-violet-200/70 leading-relaxed">
                {result.rationale}
              </p>
            </section>
          </GlassCard>

          <GlassCard hover={false} className="p-5 border-emerald-400/20 space-y-4">
            <h3 className="text-sm font-semibold text-violet-100/90">
              Müşteriye gönder
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <input
                className="px-3 py-2 rounded-xl glass border border-white/10 bg-violet-950/30 text-white text-sm"
                placeholder="Müşteri adı (PDF için zorunlu)"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
              <input
                className="px-3 py-2 rounded-xl glass border border-white/10 bg-violet-950/30 text-white text-sm"
                placeholder="Telefon"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
              <input
                type="email"
                className="px-3 py-2 rounded-xl glass border border-white/10 bg-violet-950/30 text-white text-sm"
                placeholder="E-posta"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openWhatsAppWithMessage(customerMessage)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm bg-emerald-600/80 text-white hover:opacity-90"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
              <a
                href={buildCustomerMailto(customerMessage, clientEmail)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-white/15 text-violet-100/90 hover:bg-white/5"
              >
                <Mail className="w-4 h-4" />
                E-posta
              </a>
              <button
                type="button"
                onClick={() => void exportCustomerPdf()}
                disabled={pdfLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-fuchsia-400/30 text-fuchsia-100/90 hover:bg-fuchsia-500/10 disabled:opacity-50"
              >
                {pdfLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileOutput className="w-4 h-4" />
                )}
                PDF (müşteri)
              </button>
              <button
                type="button"
                onClick={() =>
                  void navigator.clipboard.writeText(customerMessage)
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-violet-300/70 hover:text-white"
              >
                <Copy className="w-4 h-4" />
                Metni kopyala
              </button>
            </div>
            {exportError && (
              <p className="text-xs text-rose-400">{exportError}</p>
            )}
            <p className="text-[10px] text-violet-400/50 leading-relaxed">
              WhatsApp ve e-posta ön teklif metnidir. PDF resmi teklif belgesi
              üretir; müşteri adı ve iletişim bilgisi gerekir.
            </p>
          </GlassCard>

          {inputs.workType === "print" && (
            <GlassCard hover={false} className="p-4 border-cyan-400/15">
              <p className="text-xs text-violet-200/60">
                Filament + elektrik maliyeti için{" "}
                <LocaleLink
                  href="/admin/hesaplama"
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  Ücret Hesaplama
                </LocaleLink>{" "}
                sayfasını da kullanın; bu robot hizmet / proje ücretidir.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function BreakdownLine({
  label,
  value,
  signed,
}: {
  label: string;
  value: number;
  signed?: boolean;
}) {
  return (
    <li className="flex justify-between gap-4">
      <span className="text-violet-200/70">{label}</span>
      <span
        className={cn(
          "font-semibold tabular-nums shrink-0",
          signed && value > 0 && "text-amber-200/90"
        )}
      >
        {signed && value > 0 ? "+" : ""}
        {formatPrice(value)}
      </span>
    </li>
  );
}
