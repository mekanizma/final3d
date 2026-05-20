"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Zap,
  Spool,
  TrendingUp,
  Copy,
  RotateCcw,
  Info,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatPrice, cn } from "@/lib/utils";
import {
  PRINT_COST_DEFAULTS,
  calculatePrintCost,
  type PrintCostInputs,
} from "@/lib/printCostCalculator";

type FieldKey = keyof PrintCostInputs;

const fields: {
  key: FieldKey;
  label: string;
  suffix?: string;
  step?: string;
  min?: number;
  hint?: string;
}[] = [
  {
    key: "filamentPricePerKg",
    label: "1 kg filament fiyatı",
    suffix: "₺",
    step: "1",
    hint: "Spool etiketindeki kg başına fiyat",
  },
  {
    key: "printGrams",
    label: "Baskı ağırlığı",
    suffix: "g",
    step: "1",
    hint: "Slicer’dan veya tartıdan gram cinsinden",
  },
  {
    key: "printHours",
    label: "Baskı süresi (saat)",
    step: "1",
    min: 0,
  },
  {
    key: "printMinutes",
    label: "Baskı süresi (dakika)",
    step: "1",
    min: 0,
    hint: "0–59 arası",
  },
  {
    key: "powerWatts",
    label: "Yazıcı güç tüketimi",
    suffix: "W",
    step: "10",
    hint: "Ortalama ~120–200 W (FDM)",
  },
  {
    key: "electricityPricePerKwh",
    label: "Elektrik birim fiyatı",
    suffix: "₺/kWh",
    step: "0.1",
    hint: "Faturanızdaki kWh birim fiyatı",
  },
  {
    key: "quantity",
    label: "Adet",
    step: "1",
    min: 1,
  },
];

function loadSaved(): PrintCostInputs {
  return { ...PRINT_COST_DEFAULTS };
}

async function loadFromServer(): Promise<PrintCostInputs> {
  try {
    const res = await fetch("/api/admin/settings/print-cost", {
      credentials: "include",
    });
    if (!res.ok) return loadSaved();
    return (await res.json()) as PrintCostInputs;
  } catch {
    return loadSaved();
  }
}

async function saveToServer(inputs: PrintCostInputs): Promise<void> {
  await fetch("/api/admin/settings/print-cost", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inputs),
  });
}

export function PrintCostCalculator() {
  const [inputs, setInputs] = useState<PrintCostInputs>({
    ...PRINT_COST_DEFAULTS,
  });
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    void loadFromServer().then((data) => {
      setInputs(data);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => {
      void saveToServer(inputs);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputs, hydrated]);

  const breakdown = useMemo(() => calculatePrintCost(inputs), [inputs]);

  function setNumber(key: FieldKey, value: string) {
    const n = value === "" ? 0 : Number(value);
    setInputs((prev) => ({ ...prev, [key]: Number.isFinite(n) ? n : 0 }));
  }

  function reset() {
    setInputs({ ...PRINT_COST_DEFAULTS });
  }

  async function copySummary() {
    const text = [
      "Final3d — Baskı Fiyat Hesabı",
      `Filament (1 kg): ${formatPrice(inputs.filamentPricePerKg)}`,
      `Kullanılan: ${inputs.printGrams} g → ${formatPrice(breakdown.filamentCost)}`,
      `Süre: ${breakdown.printDurationHours} sa · ${breakdown.energyKwh} kWh → ${formatPrice(breakdown.electricityCost)}`,
      `Üretim maliyeti: ${formatPrice(breakdown.productionCost)}`,
      `Kar (%${inputs.profitMarginPercent}): ${formatPrice(breakdown.profitAmount)}`,
      `Satış (1 adet): ${formatPrice(breakdown.unitSalePrice)}`,
      inputs.quantity > 1
        ? `Toplam (${inputs.quantity} adet): ${formatPrice(breakdown.totalSalePrice)}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const margin = inputs.profitMarginPercent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-cyan-500/20 border border-white/10 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Ücret Hesaplama</h1>
            <p className="text-sm text-violet-200/60">
              Filament + elektrik maliyeti, %60 kar marjı ile satış fiyatı
            </p>
          </div>
        </div>
        <p className="text-xs text-violet-300/45 flex items-start gap-2 mt-3 max-w-2xl">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          Prusa tarzı hesap mantığının sadeleştirilmiş hali: gerçek girdi
          değerlerinizle maliyet kalemlerini ayrı ayrı görürsünüz.{" "}
          <a
            href="https://blog.prusa3d.com/3d-printing-price-calculator_38905/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400/80 hover:text-cyan-300 underline"
          >
            Prusa hesaplayıcı
          </a>
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <GlassCard hover={false} className="lg:col-span-2 p-6 border-white/10">
          <h2 className="text-sm font-semibold text-violet-200/80 mb-5 flex items-center gap-2">
            <Spool className="w-4 h-4 text-fuchsia-300" />
            Girdiler
          </h2>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-violet-200/70 mb-1.5">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={field.min ?? 0}
                    step={field.step ?? "any"}
                    value={inputs[field.key] === 0 ? "" : inputs[field.key]}
                    onChange={(e) => setNumber(field.key, e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass border border-white/10 bg-violet-950/30 text-white text-sm focus:outline-none focus:border-cyan-400/40 pr-12"
                  />
                  {field.suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-violet-400/60">
                      {field.suffix}
                    </span>
                  )}
                </div>
                {field.hint && (
                  <p className="text-[10px] text-violet-300/40 mt-1">
                    {field.hint}
                  </p>
                )}
              </div>
            ))}

            <div className="pt-2 border-t border-white/10">
              <label className="block text-xs font-medium text-violet-200/70 mb-1.5">
                Kar marjı
              </label>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm font-semibold text-emerald-200">
                  %{margin} sabit
                </span>
                <span className="text-[10px] text-violet-300/50 ml-auto">
                  üretim maliyeti üzerine
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
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
                onClick={copySummary}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm bg-gradient-to-r from-fuchsia-500/80 to-violet-600/80 text-white hover:opacity-90 transition-opacity"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Kopyalandı" : "Özet kopyala"}
              </button>
            </div>
          </div>
        </GlassCard>

        <div className="lg:col-span-3 space-y-4">
          <GlassCard
            hover={false}
            className="p-6 border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-transparent"
          >
            <p className="text-xs uppercase tracking-wider text-violet-300/50 mb-1">
              Önerilen satış fiyatı
            </p>
            <p className="text-4xl sm:text-5xl font-bold text-neon tabular-nums">
              {formatPrice(breakdown.unitSalePrice)}
            </p>
            {inputs.quantity > 1 && (
              <p className="text-sm text-violet-200/60 mt-2">
                {inputs.quantity} adet toplam:{" "}
                <strong className="text-cyan-300">
                  {formatPrice(breakdown.totalSalePrice)}
                </strong>
              </p>
            )}
            <p className="text-xs text-violet-300/45 mt-3">
              Üretim {formatPrice(breakdown.productionCost)} + kar{" "}
              {formatPrice(breakdown.profitAmount)} (%{margin})
            </p>
          </GlassCard>

          <GlassCard hover={false} className="p-6 border-white/10">
            <h2 className="text-sm font-semibold text-violet-200/80 mb-4">
              Maliyet dökümü (gerçek veriler)
            </h2>
            <ul className="space-y-3">
              <BreakdownRow
                icon={Spool}
                iconClass="text-fuchsia-300"
                label="Filament maliyeti"
                detail={`${inputs.printGrams} g × ${formatPrice(breakdown.costPerGram)}/g`}
                sub={`1 kg = ${formatPrice(inputs.filamentPricePerKg)}`}
                value={breakdown.filamentCost}
              />
              <BreakdownRow
                icon={Zap}
                iconClass="text-amber-300"
                label="Elektrik maliyeti"
                detail={`${breakdown.energyKwh} kWh × ${formatPrice(inputs.electricityPricePerKwh)}/kWh`}
                sub={`${inputs.powerWatts} W × ${breakdown.printDurationHours} sa baskı`}
                value={breakdown.electricityCost}
              />
              <li className="border-t border-white/10 pt-3 flex justify-between text-sm">
                <span className="text-violet-200/70">Üretim maliyeti (ara)</span>
                <span className="font-semibold tabular-nums">
                  {formatPrice(breakdown.productionCost)}
                </span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-emerald-300/80">
                  Kar marjı (%{margin})
                </span>
                <span className="font-semibold text-emerald-300 tabular-nums">
                  +{formatPrice(breakdown.profitAmount)}
                </span>
              </li>
              <li className="border-t border-fuchsia-400/20 pt-3 flex justify-between">
                <span className="font-semibold">Satış fiyatı (1 adet)</span>
                <span className="text-lg font-bold text-neon tabular-nums">
                  {formatPrice(breakdown.unitSalePrice)}
                </span>
              </li>
            </ul>
          </GlassCard>

          <GlassCard hover={false} className="p-5 border-white/5">
            <h3 className="text-xs font-semibold text-violet-300/60 uppercase tracking-wider mb-3">
              Formül özeti
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-[11px] text-violet-200/55 font-mono leading-relaxed">
              <p className="glass rounded-lg p-3 border border-white/5">
                filament = (kg_fiyat / 1000) × gram
              </p>
              <p className="glass rounded-lg p-3 border border-white/5">
                elektrik = (W / 1000) × saat × ₺/kWh
              </p>
              <p className="glass rounded-lg p-3 border border-white/5 sm:col-span-2">
                satış = (filament + elektrik) × (1 + {margin / 100})
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}

function BreakdownRow({
  icon: Icon,
  iconClass,
  label,
  detail,
  sub,
  value,
}: {
  icon: typeof Spool;
  iconClass: string;
  label: string;
  detail: string;
  sub: string;
  value: number;
}) {
  return (
    <li className="flex gap-3 items-start">
      <div
        className={cn(
          "w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0",
          iconClass
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/90">{label}</p>
        <p className="text-xs text-cyan-200/70 mt-0.5">{detail}</p>
        <p className="text-[10px] text-violet-300/45">{sub}</p>
      </div>
      <span className="text-sm font-semibold tabular-nums shrink-0">
        {formatPrice(value)}
      </span>
    </li>
  );
}

