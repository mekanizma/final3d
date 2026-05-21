"use client";

import { useEffect, useState } from "react";
import { Settings2, ChevronDown, Save } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import {
  DEFAULT_SCAN_PRICING_CONFIG,
  parseScanPricingConfig,
  type ScanPriceRange,
  type ScanPricingConfig,
} from "@/lib/scanPricingConfig";

async function loadConfig(): Promise<ScanPricingConfig> {
  try {
    const res = await fetch("/api/admin/settings/scan-pricing", {
      credentials: "include",
    });
    if (!res.ok) return { ...DEFAULT_SCAN_PRICING_CONFIG };
    return parseScanPricingConfig(await res.json());
  } catch {
    return { ...DEFAULT_SCAN_PRICING_CONFIG };
  }
}

async function saveConfig(config: ScanPricingConfig): Promise<void> {
  await fetch("/api/admin/settings/scan-pricing", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
}

function RangeRow({
  label,
  range,
  onChange,
}: {
  label: string;
  range: ScanPriceRange;
  onChange: (r: ScanPriceRange) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_5rem_5rem] gap-2 items-center text-xs">
      <span className="text-violet-200/70 truncate">{label}</span>
      <input
        type="number"
        min={0}
        step={100}
        value={range.min}
        onChange={(e) =>
          onChange({ ...range, min: Math.max(0, Number(e.target.value) || 0) })
        }
        className="px-2 py-1.5 rounded-lg glass border border-white/10 bg-violet-950/30 text-white text-xs"
        title="Min TL"
      />
      <input
        type="number"
        min={0}
        step={100}
        value={range.max}
        onChange={(e) =>
          onChange({
            ...range,
            max: Math.max(range.min, Number(e.target.value) || 0),
          })
        }
        className="px-2 py-1.5 rounded-lg glass border border-white/10 bg-violet-950/30 text-white text-xs"
        title="Max TL"
      />
    </div>
  );
}

function MultRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_4rem] gap-2 items-center text-xs">
      <span className="text-violet-200/70">{label}</span>
      <input
        type="number"
        min={0.1}
        max={5}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Math.max(0.1, Number(e.target.value) || 1))}
        className="px-2 py-1.5 rounded-lg glass border border-white/10 bg-violet-950/30 text-white text-xs"
      />
    </div>
  );
}

export function ScanPricingSettingsPanel({
  onConfigChange,
}: {
  onConfigChange: (config: ScanPricingConfig) => void;
}) {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<ScanPricingConfig>({
    ...DEFAULT_SCAN_PRICING_CONFIG,
  });
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadConfig().then((c) => {
      setConfig(c);
      onConfigChange(c);
      setHydrated(true);
    });
  }, [onConfigChange]);

  useEffect(() => {
    if (!hydrated) return;
    onConfigChange(config);
    const timer = setTimeout(() => {
      setSaving(true);
      void saveConfig(config).finally(() => setSaving(false));
    }, 600);
    return () => clearTimeout(timer);
  }, [config, hydrated, onConfigChange]);

  function patchRange(
    section: keyof ScanPricingConfig["ranges"],
    key: string,
    range: ScanPriceRange
  ) {
    setConfig((c) => ({
      ...c,
      ranges: {
        ...c.ranges,
        [section]: { ...c.ranges[section], [key]: range },
      },
    }));
  }

  function patchMult(
    group: keyof ScanPricingConfig["multipliers"],
    key: string,
    value: number
  ) {
    setConfig((c) => ({
      ...c,
      multipliers: {
        ...c.multipliers,
        [group]: { ...c.multipliers[group], [key]: value },
      },
    }));
  }

  return (
    <GlassCard hover={false} className="mb-6 border-white/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-violet-100/90">
          <Settings2 className="w-4 h-4 text-fuchsia-300" />
          Fiyat tabloları ve çarpanlar
          {saving && (
            <span className="text-[10px] font-normal text-violet-400/60">
              kaydediliyor…
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-violet-300 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-5 border-t border-white/10 pt-4">
          <p className="text-[10px] text-violet-300/50">
            Min / max TL (solda etiket). Değişiklikler otomatik kaydedilir.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-cyan-300/80">3D tarama</h4>
              {(["small", "medium", "large"] as const).map((k) => (
                <RangeRow
                  key={k}
                  label={k === "small" ? "Küçük" : k === "medium" ? "Orta" : "Büyük"}
                  range={config.ranges.scan[k]}
                  onChange={(r) => patchRange("scan", k, r)}
                />
              ))}
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-cyan-300/80">Modelleme</h4>
              {(["low", "medium", "high"] as const).map((k) => (
                <RangeRow
                  key={k}
                  label={
                    k === "low" ? "Basit" : k === "medium" ? "Orta CAD" : "Profesyonel"
                  }
                  range={config.ranges.modeling[k]}
                  onChange={(r) => patchRange("modeling", k, r)}
                />
              ))}
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-cyan-300/80">
                Reverse engineering
              </h4>
              {(["small", "medium", "large"] as const).map((k) => (
                <RangeRow
                  key={k}
                  label={k === "small" ? "Küçük" : k === "medium" ? "Orta" : "Büyük"}
                  range={config.ranges.reverse[k]}
                  onChange={(r) => patchRange("reverse", k, r)}
                />
              ))}
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-cyan-300/80">3D baskı hizmeti</h4>
              {(["small", "medium", "large"] as const).map((k) => (
                <RangeRow
                  key={k}
                  label={k === "small" ? "Küçük" : k === "medium" ? "Orta" : "Büyük"}
                  range={config.ranges.print[k]}
                  onChange={(r) => patchRange("print", k, r)}
                />
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-fuchsia-300/80">Detay</h4>
              <MultRow
                label="Düşük"
                value={config.multipliers.detail.low}
                onChange={(v) => patchMult("detail", "low", v)}
              />
              <MultRow
                label="Orta"
                value={config.multipliers.detail.medium}
                onChange={(v) => patchMult("detail", "medium", v)}
              />
              <MultRow
                label="Yüksek"
                value={config.multipliers.detail.high}
                onChange={(v) => patchMult("detail", "high", v)}
              />
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-fuchsia-300/80">Aciliyet</h4>
              <MultRow
                label="Normal"
                value={config.multipliers.urgency.normal}
                onChange={(v) => patchMult("urgency", "normal", v)}
              />
              <MultRow
                label="Hızlı"
                value={config.multipliers.urgency.fast}
                onChange={(v) => patchMult("urgency", "fast", v)}
              />
              <MultRow
                label="Acil"
                value={config.multipliers.urgency.urgent}
                onChange={(v) => patchMult("urgency", "urgent", v)}
              />
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-fuchsia-300/80">Müşteri</h4>
              <MultRow
                label="Bireysel"
                value={config.multipliers.customer.individual}
                onChange={(v) => patchMult("customer", "individual", v)}
              />
              <MultRow
                label="Kurumsal"
                value={config.multipliers.customer.corporate}
                onChange={(v) => patchMult("customer", "corporate", v)}
              />
              <MultRow
                label="Endüstriyel"
                value={config.multipliers.customer.industrial}
                onChange={(v) => patchMult("customer", "industrial", v)}
              />
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-fuchsia-300/80">
                Önerilen oran
              </h4>
              <MultRow
                label="Aralık payı"
                value={config.recommendedShare}
                onChange={(v) =>
                  setConfig((c) => ({
                    ...c,
                    recommendedShare: Math.min(0.95, Math.max(0.1, v)),
                  }))
                }
              />
              <p className="text-[10px] text-violet-400/50 flex items-center gap-1">
                <Save className="w-3 h-3" />
                0,62 = %62 üst banda yakın değil
              </p>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
