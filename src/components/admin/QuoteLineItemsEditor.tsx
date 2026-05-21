"use client";

import { Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { QuoteLineItem } from "@/lib/billing/quoteTypes";
import {
  defaultLineItem,
  lineItemTotal,
  quoteGrandTotal,
} from "@/lib/billing/quoteTypes";
import { useIntl } from "@/components/i18n/IntlProvider";

interface QuoteLineItemsEditorProps {
  items: QuoteLineItem[];
  onChange: (items: QuoteLineItem[]) => void;
}

export function QuoteLineItemsEditor({
  items,
  onChange,
}: QuoteLineItemsEditorProps) {
  const { t } = useIntl();
  const total = quoteGrandTotal(items);

  function update(index: number, patch: Partial<QuoteLineItem>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function remove(index: number) {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-violet-100/90">
          {t("adminBilling.quote.lineItems")}
        </p>
        <button
          type="button"
          onClick={() => onChange([...items, defaultLineItem()])}
          className="inline-flex items-center gap-1 text-xs text-cyan-300 hover:underline"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden />
          {t("adminBilling.quote.addLine")}
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end p-3 rounded-xl border border-white/10 bg-white/[0.03]"
          >
            <div className="sm:col-span-5">
              <label className="text-[10px] text-violet-300/60">
                {t("adminBilling.quote.colDesc")}
              </label>
              <input
                className="input-field mt-1"
                value={item.description}
                onChange={(e) =>
                  update(index, { description: e.target.value })
                }
                placeholder={t("adminBilling.quote.descPh")}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] text-violet-300/60">
                {t("adminBilling.quote.colQty")}
              </label>
              <input
                type="number"
                min={1}
                className="input-field mt-1"
                value={item.quantity || ""}
                onChange={(e) =>
                  update(index, { quantity: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] text-violet-300/60">
                {t("adminBilling.quote.colUnit")}
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                className="input-field mt-1"
                value={item.unitPrice || ""}
                onChange={(e) =>
                  update(index, { unitPrice: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div className="sm:col-span-2 flex items-end justify-between gap-2">
              <div>
                <label className="text-[10px] text-violet-300/60">
                  {t("adminBilling.quote.colLine")}
                </label>
                <p className="text-sm font-semibold text-neon mt-2">
                  {formatPrice(lineItemTotal(item))}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={items.length <= 1}
                className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 disabled:opacity-30"
                aria-label={t("adminBilling.quote.removeLine")}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-right text-sm font-bold text-neon">
        {t("adminBilling.quote.grandTotal")}: {formatPrice(total)}
      </p>
    </div>
  );
}
