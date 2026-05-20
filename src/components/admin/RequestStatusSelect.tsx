"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIntl } from "@/components/i18n/IntlProvider";
import type { RequestStatus } from "@/lib/constants";

const options: RequestStatus[] = ["yeni", "inceleniyor", "teklif-gonderildi"];

interface RequestStatusSelectProps {
  value: RequestStatus;
  onChange: (value: RequestStatus) => void;
  className?: string;
}

export function RequestStatusSelect({
  value,
  onChange,
  className,
}: RequestStatusSelectProps) {
  const { t } = useIntl();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs glass border border-white/10 hover:border-cyan-400/35"
      >
        <span>{t(`requestStatus.${value}`)}</span>
        <ChevronDown className={cn("w-3.5 h-3.5", open && "rotate-180")} />
      </button>
      {open && (
        <ul className="absolute right-0 z-50 mt-2 min-w-[160px] py-1 rounded-xl border border-fuchsia-400/25 bg-[#1a0f3d] shadow-xl">
          {options.map((key) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-white/5"
              >
                <span className="flex-1">{t(`requestStatus.${key}`)}</span>
                {key === value && <Check className="w-3.5 h-3.5 text-cyan-300" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
