"use client";

import { useState, useEffect } from "react";
import { ProductPhoto } from "@/components/ui/ProductPhoto";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useIntl } from "@/components/i18n/IntlProvider";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { motion } from "framer-motion";
import { CreditCard, MapPin, Phone, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCartHydrated } from "@/hooks/useCartHydrated";
import { useAuthHydrated } from "@/hooks/useAuthHydrated";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { formatPrice } from "@/lib/utils";
import { calculateOrderTotals } from "@/lib/pricing";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { FormInput, FormTextarea } from "@/components/ui/FormField";
import { OrderTotalsSummary } from "@/components/order/OrderTotalsSummary";
import { ShippingPromo } from "@/components/shipping/ShippingPromo";
import { requestOrderConfirmationEmail } from "@/services/orderEmailService";
import { getProductName } from "@/lib/product-i18n";

export default function OrderPage() {
  const { push, replace } = useLocaleRouter();
  const { locale, t } = useIntl();
  const cartHydrated = useCartHydrated();
  const authHydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const { items, clearCart } = useCartStore();
  const displayItems = cartHydrated ? items : [];
  const subtotal = displayItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const orderTotals = calculateOrderTotals(subtotal);
  const createOrder = useOrderStore((s) => s.createOrder);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    note: "",
  });

  useEffect(() => {
    if (!authHydrated) return;
    if (!user) {
      replace("/giris?return=/order");
      return;
    }
    setForm((prev) => ({
      ...prev,
      customerName: user.name,
      phone: user.phone || prev.phone,
      address: user.address || prev.address,
    }));
  }, [authHydrated, user, replace]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || items.length === 0) return;
    setLoading(true);
    try {
      const order = await createOrder({
        ...form,
        userId: user.id,
        userEmail: user.email,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      });

      let emailStatus = "failed";
      try {
        const emailResult = await requestOrderConfirmationEmail(order);
        emailStatus = emailResult.sent
          ? "sent"
          : emailResult.mock
            ? "mock"
            : "failed";
      } catch {
        emailStatus = "failed";
      }

      clearCart();
      push(`/order/success?id=${order.id}&email=${emailStatus}`);
    } catch {
      alert(t("order.failAlert"));
    } finally {
      setLoading(false);
    }
  }

  if (!authHydrated || !user) {
    return (
      <motion.div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-fuchsia-500/30 border-t-cyan-400 rounded-full animate-spin" />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <motion.div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-2"
        >
          {t("order.title")} <span className="text-neon">{t("order.titleNeon")}</span>
        </motion.h1>
        <p className="text-violet-200/60 mb-2">{t("order.subtitle")}</p>
        <p className="text-sm text-violet-300/50 mb-6">
          {t("order.savedAs")}{" "}
          <span className="text-cyan-300/80">{user.email}</span>
        </p>
        <ShippingPromo className="mb-8" />

        {!cartHydrated ? (
          <GlassCard hover={false} className="p-12 text-center">
            <motion.div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          </GlassCard>
        ) : displayItems.length === 0 ? (
          <GlassCard hover={false} className="p-12 text-center">
            <p className="text-slate-400 mb-6">{t("order.emptyCart")}</p>
            <NeonButton onClick={() => push("/")}>
              {t("order.startShopping")}
            </NeonButton>
          </GlassCard>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
              <GlassCard hover={false} className="p-6 space-y-4">
                <h2 className="font-semibold mb-4">{t("order.deliveryInfo")}</h2>
                <FormInput
                  icon={User}
                  placeholder={t("order.namePh")}
                  required
                  value={form.customerName}
                  onChange={(e) =>
                    setForm({ ...form, customerName: e.target.value })
                  }
                />
                <FormInput
                  icon={Phone}
                  type="tel"
                  placeholder={t("order.phonePh")}
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <FormTextarea
                  icon={MapPin}
                  placeholder={t("order.addressPh")}
                  required
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
                <textarea
                  className="input-field min-h-[80px] resize-none w-full"
                  placeholder={t("order.notePh")}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </GlassCard>

              <GlassCard hover={false} className="p-6">
                <motion.div className="flex items-center gap-3 text-sm">
                  <CreditCard className="w-5 h-5 shrink-0 text-cyan-400" />
                  <div>
                    <p className="font-medium">{t("order.codTitle")}</p>
                    <p className="text-violet-200/50 text-xs mt-0.5">
                      {t("order.codHint")}
                    </p>
                  </div>
                </motion.div>
              </GlassCard>

              <NeonButton
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? t("order.submitting") : t("order.submit")}
              </NeonButton>
            </form>

            <div className="lg:col-span-2">
              <GlassCard hover={false} className="p-6 sticky top-24">
                <h2 className="font-semibold mb-4">{t("order.summary")}</h2>
                <div className="space-y-3 mb-6">
                  {displayItems.map((item) => {
                    const itemName = getProductName(item.product, locale);
                    return (
                    <div
                      key={item.product.id}
                      className="flex gap-3 items-center"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <ProductPhoto
                          src={item.product.image}
                          alt={itemName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{itemName}</p>
                        <p className="text-xs text-slate-500">
                          x{item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  );
                  })}
                </div>
                <div className="border-t border-white/5 pt-4 mt-2">
                  <OrderTotalsSummary
                    subtotal={subtotal}
                    totals={orderTotals}
                  />
                </div>
              </GlassCard>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
