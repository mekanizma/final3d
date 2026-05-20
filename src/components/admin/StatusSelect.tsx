"use client";

import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import type { OrderStatus } from "@/types";

const statuses: OrderStatus[] = [
  "yeni",
  "hazirlaniyor",
  "kargoda",
  "teslim-edildi",
];

const statusStyles: Record<OrderStatus, string> = {
  yeni: "border-blue-400/40 text-blue-200",
  hazirlaniyor: "border-purple-400/40 text-purple-200",
  kargoda: "border-amber-400/40 text-amber-200",
  "teslim-edildi": "border-emerald-400/40 text-emerald-200",
};

interface StatusSelectProps {
  value: OrderStatus;
  onChange: (status: OrderStatus) => void;
}

export function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <select
      className={cn(
        "input-field select-field w-auto min-w-[160px] text-sm py-2",
        statusStyles[value]
      )}
      value={value}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
    >
      {statuses.map((s) => (
        <option key={s} value={s} className="select-option">
          {ORDER_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
