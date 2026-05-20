"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, ChevronDown, Globe } from "lucide-react";
import { locales, localeLabels } from "@/i18n/config";
import { getLocaleFromPathname, stripLocalePath, withLocale } from "@/lib/locale-path";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  className,
  fullWidth = false,
}: {
  className?: string;
  fullWidth?: boolean;
}) {
  const pathname = usePathname() || "/";
  const current = getLocaleFromPathname(pathname);
  const bare = stripLocalePath(pathname);
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
    <div ref={rootRef} className={cn("relative", fullWidth && "w-full", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={localeLabels[current]}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm",
          "border border-white/10 bg-white/[0.04]",
          "hover:bg-white/10 hover:border-white/20 transition-colors",
          "focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/15",
          open && "border-cyan-400/40 ring-2 ring-cyan-400/15",
          fullWidth && "w-full justify-between"
        )}
      >
        <span className="flex items-center gap-1.5 min-w-0">
          <Globe className="w-4 h-4 text-violet-300/80 shrink-0" aria-hidden />
          <span className="font-semibold text-violet-100 truncate">
            {localeLabels[current]}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-violet-300/70 shrink-0 transition-transform",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={localeLabels[current]}
          className={cn(
            "absolute z-[110] mt-2 py-1.5 rounded-xl border border-fuchsia-400/25",
            "bg-[#1a0f3d] shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl",
            fullWidth ? "inset-x-0 w-full" : "right-0 min-w-[150px]"
          )}
        >
          {locales.map((loc) => {
            const href = withLocale(bare === "/" ? "/" : bare, loc);
            const active = loc === current;
            return (
              <li key={loc} role="option" aria-selected={active}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/10 text-white"
                      : "text-violet-200/80 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span className="flex-1">{localeLabels[loc]}</span>
                  {active && (
                    <Check className="w-4 h-4 text-cyan-300 shrink-0" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
