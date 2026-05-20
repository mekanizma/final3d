"use client";

import { Truck } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { useIntl } from "@/components/i18n/IntlProvider";
import { tFormat } from "@/lib/t-format";

interface ShippingPromoProps {
  variant?: "banner" | "inline" | "compact";
  className?: string;
}

export function ShippingPromo({
  variant = "banner",
  className,
}: ShippingPromoProps) {
  const { t } = useIntl();
  const amount = formatPrice(FREE_SHIPPING_THRESHOLD);

  if (variant === "compact") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-[10px] text-emerald-300/90",
          className
        )}
      >
        <Truck className="w-3 h-3" />
        {tFormat(t, "checkout.promoCompact", { amount })}
      </span>
    );
  }

  if (variant === "inline") {
    return (
      <p
        className={cn(
          "text-xs text-violet-200/60 flex items-center gap-1.5 flex-wrap",
          className
        )}
      >
        <Truck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>
          {tFormat(t, "checkout.promoInline", { amount })}{" "}
          <strong className="text-emerald-400/90">
            {t("checkout.promoInlineStrong")}
          </strong>
        </span>
      </p>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-cyan-400/25 bg-cyan-500/10 px-4 py-3 text-sm",
        className
      )}
    >
      <div className="w-9 h-9 rounded-lg bg-cyan-400/15 flex items-center justify-center shrink-0">
        <Truck className="w-5 h-5 text-cyan-300" strokeWidth={2} />
      </div>
      <div>
        <p className="font-medium text-cyan-100/95">
          {tFormat(t, "checkout.promoBanner", { amount })}
        </p>
        <p className="text-xs text-violet-200/55 mt-0.5">
          {t("checkout.promoBelow")}
        </p>
      </div>
    </div>
  );
}
