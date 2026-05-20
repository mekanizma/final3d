"use client";

import { Truck } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import {
  calculateOrderTotals,
  FREE_SHIPPING_THRESHOLD,
  type OrderTotals,
} from "@/lib/pricing";
import { useIntl } from "@/components/i18n/IntlProvider";
import { tFormat } from "@/lib/t-format";

interface OrderTotalsSummaryProps {
  subtotal: number;
  totals?: OrderTotals;
  showFreeShippingHint?: boolean;
  className?: string;
}

export function OrderTotalsSummary({
  subtotal,
  totals: totalsProp,
  showFreeShippingHint = true,
  className,
}: OrderTotalsSummaryProps) {
  const { t } = useIntl();
  const totals = totalsProp ?? calculateOrderTotals(subtotal);
  const threshold = formatPrice(FREE_SHIPPING_THRESHOLD);

  return (
    <div className={cn("space-y-2 text-sm min-w-0", className)}>
      <div className="flex justify-between gap-3 text-violet-200/70 min-w-0">
        <span className="shrink-0">{t("checkout.subtotal")}</span>
        <span className="tabular-nums text-right shrink-0">
          {formatPrice(totals.subtotal)}
        </span>
      </div>
      <div className="flex justify-between gap-3 text-violet-200/70 min-w-0">
        <span className="flex items-center gap-1.5 min-w-0">
          <Truck className="w-3.5 h-3.5 text-cyan-400/80 shrink-0" />
          <span className="truncate">{t("checkout.shipping")}</span>
        </span>
        {totals.freeShipping ? (
          <span className="text-emerald-400 font-medium shrink-0">
            {t("checkout.free")}
          </span>
        ) : (
          <span className="tabular-nums shrink-0">
            {formatPrice(totals.shippingFee)}
          </span>
        )}
      </div>
      <div className="border-t border-white/10 pt-3 flex justify-between gap-3 font-bold text-base min-w-0">
        <span className="shrink-0">{t("checkout.grandTotal")}</span>
        <span className="text-neon tabular-nums text-right shrink-0">
          {formatPrice(totals.total)}
        </span>
      </div>
      {showFreeShippingHint && !totals.freeShipping && totals.subtotal > 0 && (
        <p className="text-[11px] text-amber-200/70 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-2 break-words">
          {tFormat(t, "checkout.hintAdd", {
            amount: formatPrice(totals.amountUntilFreeShipping),
            threshold,
          })}
        </p>
      )}
      {showFreeShippingHint && totals.freeShipping && totals.subtotal > 0 && (
        <p className="text-[11px] text-emerald-300/80 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-2.5 py-2 break-words">
          {tFormat(t, "checkout.hintFree", { threshold })}
        </p>
      )}
    </div>
  );
}
