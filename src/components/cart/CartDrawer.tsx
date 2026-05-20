"use client";

import { useEffect } from "react";
import { ProductPhoto } from "@/components/ui/ProductPhoto";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useIntl } from "@/components/i18n/IntlProvider";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { getProductName } from "@/lib/product-i18n";
import { formatPrice, cn } from "@/lib/utils";
import { calculateOrderTotals } from "@/lib/pricing";
import { NeonButton } from "@/components/ui/NeonButton";
import { OrderTotalsSummary } from "@/components/order/OrderTotalsSummary";
import { ShippingPromo } from "@/components/shipping/ShippingPromo";

export function CartDrawer() {
  const { locale, t } = useIntl();
  const { items, isOpen, setOpen, updateQuantity, removeItem, totalPrice } =
    useCartStore();
  const subtotal = totalPrice();
  const totals = calculateOrderTotals(subtotal);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("cart.title")}
            className={cn(
              "fixed inset-y-0 right-0 z-[120]",
              "flex w-full max-w-[100vw] flex-col",
              "sm:max-w-md",
              "glass border-l border-white/10",
              "overflow-hidden overscroll-contain",
              "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
            )}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/5 px-4 py-3 sm:px-6 sm:py-4 min-w-0">
              <h2 className="text-base sm:text-lg font-bold truncate min-w-0">
                {t("cart.title")}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 p-2 -mr-1 rounded-xl hover:bg-white/10 transition-colors"
                aria-label={t("cart.close")}
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <motion.div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6 sm:py-5 space-y-3 sm:space-y-4">
              {items.length === 0 ? (
                <p className="text-violet-300/50 text-center py-12 text-sm">
                  {t("cart.empty")}
                </p>
              ) : (
                items.map((item) => {
                  const itemName = getProductName(item.product, locale);
                  return (
                  <motion.div
                    key={item.product.id}
                    layout
                    className="flex gap-3 sm:gap-4 glass rounded-xl p-3 min-w-0"
                  >
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0">
                      <ProductPhoto
                        src={item.product.image}
                        alt={itemName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2 leading-snug">
                        {itemName}
                      </p>
                      <p className="text-sm text-neon mt-1 tabular-nums">
                        {formatPrice(item.product.price)}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2">
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10"
                            aria-label={t("cart.decrease")}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm w-7 text-center tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10"
                            aria-label={t("cart.increase")}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="ml-auto p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
                          aria-label={t("cart.remove")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                  );
                })
              )}
            </motion.div>

            {items.length > 0 && (
              <footer className="shrink-0 border-t border-white/5 px-4 py-4 sm:px-6 sm:py-5 space-y-3 sm:space-y-4 min-w-0 overflow-hidden">
                <ShippingPromo
                  variant="inline"
                  className="text-xs break-words"
                />
                <OrderTotalsSummary
                  subtotal={subtotal}
                  totals={totals}
                  className="min-w-0"
                />
                <LocaleLink
                  href="/order"
                  onClick={() => setOpen(false)}
                  className="block min-w-0"
                >
                  <NeonButton className="w-full max-w-full">
                    {t("cart.checkout")}
                  </NeonButton>
                </LocaleLink>
              </footer>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
