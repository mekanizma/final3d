"use client";

import {
  Printer,
  Box,
  Puzzle,
  Disc3,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types";

const categories = Object.keys(CATEGORY_LABELS) as ProductCategory[];

const CATEGORY_ICONS: Record<ProductCategory, LucideIcon> = {
  "3d-print": Printer,
  model: Box,
  accessory: Puzzle,
  filament: Disc3,
  tool: Wrench,
};

interface CategoryPickerProps {
  value: ProductCategory;
  onChange: (category: ProductCategory) => void;
}

export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-violet-100/90">Kategori</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat];
          const selected = value === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onChange(cat)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all border",
                selected
                  ? "bg-gradient-to-r from-fuchsia-500/25 to-cyan-500/15 border-fuchsia-400/50 text-white shadow-[0_0_20px_rgba(232,121,249,0.15)]"
                  : "bg-white/[0.04] border-violet-400/20 text-violet-100/90 hover:border-cyan-400/40 hover:bg-white/[0.08]"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  selected
                    ? "bg-gradient-to-br from-fuchsia-500 to-cyan-500 text-white"
                    : "bg-violet-500/20 text-violet-200"
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
              </span>
              <span className="leading-tight">{CATEGORY_LABELS[cat]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
