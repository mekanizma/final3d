"use client";

import { useEffect, useMemo, useState } from "react";
import { ORDER_STATUS_COLORS } from "@/lib/constants";
import { orderStatusLabel } from "@/lib/order-labels";
import { useIntl } from "@/components/i18n/IntlProvider";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { motion } from "framer-motion";
import {
  LogOut,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  Sparkles,
  Calendar,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAuthHydrated } from "@/hooks/useAuthHydrated";
import { api } from "@/services";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { FormInput, FormTextarea } from "@/components/ui/FormField";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function shortenOrderId(id: string) {
  return id.length > 12 ? `${id.slice(0, 8)}…` : id;
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function AccountPage() {
  const { push, replace } = useLocaleRouter();
  const { t } = useIntl();
  const hydrated = useAuthHydrated();
  const { user, logout, updateProfile } = useAuthStore();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      replace("/giris");
      return;
    }
    setProfile((prev) => {
      if (
        prev.name === user.name &&
        prev.phone === user.phone &&
        prev.address === user.address
      ) {
        return prev;
      }
      return {
        name: user.name,
        phone: user.phone,
        address: user.address,
      };
    });
    const loadOrders = (resetList?: boolean) => {
      if (resetList) setOrders(null);
      api.getOrdersByUserId(user.id, user.email).then(setOrders);
    };
    loadOrders(true);
    const onFocus = () => loadOrders(false);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [hydrated, user, replace]);

  const stats = useMemo(() => {
    if (orders === null) return null;
    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
    const active = orders.filter((o) => o.status !== "teslim-edildi").length;
    return { totalSpent, active, count: orders.length };
  }, [orders]);

  if (!hydrated || !user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <motion.div
          className="w-10 h-10 border-2 border-fuchsia-500/30 border-t-cyan-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile(profile);
      setMessage(t("account.updated"));
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    push("/");
  }

  const firstName = user.name.split(" ")[0];
  const successMessage = message === t("account.updated");

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Üst profil kartı */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <motion.div
            className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-fuchsia-500/40 via-violet-500/30 to-cyan-400/40 blur-xl opacity-60"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <GlassCard
            hover={false}
            className="relative overflow-hidden p-6 sm:p-8 border-fuchsia-400/20"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 w-48 h-48 rounded-full bg-fuchsia-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 w-40 h-40 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-600 to-cyan-400 flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-[0_0_30px_rgba(232,121,249,0.45)]">
                    {getInitials(user.name)}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#12082a] flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest text-violet-300/60 mb-1">
                    {t("account.title")}
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold truncate">
                    {t("account.hello")},{" "}
                    <span className="text-neon">{firstName}</span>
                  </h1>
                  <p className="text-sm text-violet-200/65 mt-1 flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-cyan-400/80" />
                    {user.email}
                  </p>
                  <p className="text-xs text-violet-300/45 mt-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 shrink-0" />
                    {t("account.memberSince")}: {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end shrink-0">
                <LocaleLink href="/order" className="w-full sm:w-auto">
                  <NeonButton size="sm" className="w-full sm:w-auto">
                    <ShoppingBag className="w-4 h-4" />
                    {t("account.newOrder")}
                  </NeonButton>
                </LocaleLink>
                <NeonButton
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full sm:w-auto"
                >
                  <LogOut className="w-4 h-4" />
                  {t("account.logout")}
                </NeonButton>
              </div>
            </div>

            <div className="relative grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/10">
              <StatPill
                label={t("account.statOrders")}
                value={stats ? String(stats.count) : "…"}
              />
              <StatPill
                label={t("account.statActive")}
                value={stats ? String(stats.active) : "…"}
                accent="cyan"
              />
              <StatPill
                label={t("account.statSpent")}
                value={stats ? formatPrice(stats.totalSpent) : "…"}
                accent="fuchsia"
                compact
              />
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Profil formu */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="lg:col-span-2 order-2 lg:order-1"
          >
            <GlassCard hover={false} className="p-6 h-full">
              <SectionTitle
                icon={User}
                iconClass="text-cyan-300"
                title={t("account.profileTitle")}
                subtitle={t("account.profileSubtitle")}
              />

              <form onSubmit={handleProfileSave} className="space-y-4 mt-5">
                <FieldLabel>{t("account.nameLabel")}</FieldLabel>
                <FormInput
                  icon={User}
                  placeholder={t("order.namePh")}
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  required
                />

                <FieldLabel>{t("account.phoneLabel")}</FieldLabel>
                <FormInput
                  icon={Phone}
                  type="tel"
                  placeholder="+90 5xx xxx xxxx"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  required
                />

                <FieldLabel>{t("account.addressLabel")}</FieldLabel>
                <FormTextarea
                  icon={MapPin}
                  placeholder={t("auth.addressPh")}
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                  required
                />

                {message && (
                  <div
                    className={`flex items-start gap-2 text-sm rounded-xl px-3 py-2.5 border ${
                      successMessage
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                    }`}
                  >
                    {successMessage ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                    <span>{message}</span>
                  </div>
                )}

                <NeonButton type="submit" disabled={saving} className="w-full">
                  {saving ? t("account.saving") : t("account.save")}
                </NeonButton>
              </form>
            </GlassCard>
          </motion.div>

          {/* Geçmiş siparişler */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="lg:col-span-3 order-1 lg:order-2"
          >
            <GlassCard hover={false} className="p-6 h-full flex flex-col">
              <SectionTitle
                icon={Package}
                iconClass="text-fuchsia-300"
                title={t("account.ordersTitle")}
                subtitle={
                  orders === null
                    ? t("account.ordersLoading")
                    : orders.length > 0
                      ? `${orders.length} ${t("account.ordersSubtitle")}`
                      : t("account.ordersEmptyHint")
                }
              />

              {orders === null ? (
                <div className="mt-8 flex flex-1 items-center justify-center py-16">
                  <motion.div
                    className="w-10 h-10 border-2 border-fuchsia-500/30 border-t-cyan-400 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              ) : orders.length === 0 ? (
                <EmptyOrders />
              ) : (
                <div className="mt-5 space-y-3 flex-1 max-h-[min(520px,70vh)] overflow-y-auto pr-1 custom-scrollbar">
                  {orders.map((order, i) => (
                    <OrderCard key={order.id} order={order} index={i} />
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
  accent = "violet",
  compact,
}: {
  label: string;
  value: string;
  accent?: "violet" | "cyan" | "fuchsia";
  compact?: boolean;
}) {
  const accentMap = {
    violet: "from-violet-500/20 to-transparent border-violet-400/20",
    cyan: "from-cyan-500/20 to-transparent border-cyan-400/25",
    fuchsia: "from-fuchsia-500/20 to-transparent border-fuchsia-400/25",
  };

  return (
    <div
      className={`rounded-xl border bg-gradient-to-br px-3 py-3 sm:px-4 ${accentMap[accent]}`}
    >
      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-violet-300/55">
        {label}
      </p>
      <p
        className={`font-bold text-neon mt-0.5 ${compact ? "text-sm sm:text-base" : "text-lg sm:text-xl"}`}
      >
        {value}
      </p>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  iconClass,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  iconClass: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
        <Icon className={`w-5 h-5 ${iconClass}`} strokeWidth={2} />
      </div>
      <div>
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-xs text-violet-200/55 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-violet-200/70 -mb-2">
      {children}
    </label>
  );
}

function EmptyOrders() {
  const { t } = useIntl();
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 mt-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-400/20 flex items-center justify-center mb-4">
        <Package className="w-7 h-7 text-violet-300/80" strokeWidth={1.5} />
      </div>
      <p className="font-medium text-violet-100/90">{t("account.noOrders")}</p>
      <p className="text-sm text-violet-200/50 mt-1 max-w-xs">
        {t("account.noOrdersHint")}
      </p>
      <LocaleLink href="/urunler" className="mt-6">
        <NeonButton size="sm">
          <ShoppingBag className="w-4 h-4" />
          {t("account.browseProducts")}
        </NeonButton>
      </LocaleLink>
    </div>
  );
}

function OrderCard({ order, index }: { order: Order; index: number }) {
  const { t } = useIntl();
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const preview =
    order.items.length > 0
      ? `${order.items[0].productName}${order.items.length > 1 ? ` +${order.items.length - 1}` : ""}`
      : t("account.orderPreview");

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
    >
      <LocaleLink
        href={`/hesabim/siparis/${encodeURIComponent(order.id)}`}
        className="group block rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-fuchsia-400/25 transition-all p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <StatusDot status={order.status} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-violet-300/75">
                  #{shortenOrderId(order.id)}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${ORDER_STATUS_COLORS[order.status]}`}
                >
                {orderStatusLabel(order.status, t)}
              </span>
            </div>
            <p className="text-sm text-violet-100/90 mt-1 truncate">
              {preview}
            </p>
            <p className="text-xs text-violet-300/45 mt-0.5">
              {itemCount} {t("account.itemsLine")} · {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-base font-bold text-neon">
              {formatPrice(order.total)}
            </p>
            <ChevronRight className="w-4 h-4 text-violet-400/40 ml-auto mt-2 group-hover:text-cyan-300/70 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </LocaleLink>
    </motion.div>
  );
}

function StatusDot({ status }: { status: OrderStatus }) {
  const colors: Record<OrderStatus, string> = {
    yeni: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]",
    hazirlaniyor: "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]",
    kargoda: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
    "teslim-edildi": "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
  };

  return (
    <span
      className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${colors[status]}`}
      aria-hidden
    />
  );
}
