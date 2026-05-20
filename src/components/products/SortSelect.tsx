"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS, type SortOption } from "@/lib/productCatalog";
import { useIntl } from "@/components/i18n/IntlProvider";

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

export function SortSelect({ value, onChange, className }: SortSelectProps) {
  const { t } = useIntl();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("sort.aria")}
        className={cn(
          "flex items-center gap-2 min-w-[200px] sm:min-w-[220px] max-w-full",
          "py-2.5 pl-3 pr-3 rounded-xl text-sm text-left",
          "glass border border-white/10 bg-violet-950/60",
          "hover:border-cyan-400/35 hover:bg-white/5 transition-colors",
          "focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/15",
          open && "border-cyan-400/40 ring-2 ring-cyan-400/15"
        )}
      >
        <ArrowUpDown
          className="w-4 h-4 text-violet-400/70 shrink-0"
          aria-hidden
        />
        <span className="flex-1 truncate text-violet-100">
          {t(`sort.${value}`)}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-violet-400/70 shrink-0 transition-transform",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("sort.optionsAria")}
          className={cn(
            "absolute right-0 z-50 mt-2 w-full min-w-[220px]",
            "py-1.5 rounded-xl border border-fuchsia-400/25",
            "bg-[#1a0f3d] shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
            "backdrop-blur-xl"
          )}
        >
          {SORT_OPTIONS.map((key) => {
            const active = key === value;
            return (
              <li key={key} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left transition-colors",
                    active
                      ? "bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/10 text-white"
                      : "text-violet-200/80 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span className="flex-1">{t(`sort.${key}`)}</span>
                  {active && (
                    <Check className="w-4 h-4 text-cyan-300 shrink-0" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
