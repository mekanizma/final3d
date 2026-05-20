"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Package,
  Phone,
  User,
} from "lucide-react";
import { api } from "@/services";
import { useAuthStore } from "@/store/authStore";
import { useAuthHydrated } from "@/hooks/useAuthHydrated";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { OrderTotalsSummary } from "@/components/order/OrderTotalsSummary";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from "@/lib/constants";
import { orderBelongsToUser } from "@/lib/orderOwnership";
import { formatDate, formatPrice } from "@/lib/utils";
import { resolveOrderTotals } from "@/lib/pricing";
import type { Order } from "@/types";

export default function AccountOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const rawId = params.id;
  const orderId = typeof rawId === "string" ? decodeURIComponent(rawId) : "";
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace(`/giris?return=/hesabim/siparis/${encodeURIComponent(orderId)}`);
      return;
    }
    if (!orderId) {
      setOrder(null);
      return;
    }
    let cancelled = false;
    api.getOrderById(orderId).then((o) => {
      if (cancelled) return;
      if (!o || !orderBelongsToUser(o, user)) {
        setOrder(null);
        return;
      }
      setOrder(o);
    });
    return () => {
      cancelled = true;
    };
  }, [hydrated, user, router, orderId]);

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

  if (order === undefined) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <motion.div
          className="w-10 h-10 border-2 border-fuchsia-500/30 border-t-cyan-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-lg mx-auto text-center">
          <GlassCard hover={false} className="p-8">
            <p className="text-violet-200/80 mb-6">
              Bu sipariş bulunamadı veya hesabınıza ait değil.
            </p>
            <Link href="/hesabim">
              <NeonButton>
                <ArrowLeft className="w-4 h-4" />
                Hesabıma dön
              </NeonButton>
            </Link>
          </GlassCard>
        </div>
      </div>
    );
  }

  const totals = resolveOrderTotals(order);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/hesabim"
          className="inline-flex items-center gap-2 text-sm text-violet-300/70 hover:text-cyan-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Geçmiş siparişlere dön
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GlassCard hover={false} className="p-6 sm:p-8 border-fuchsia-400/15">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-violet-300/55 mb-1">
                  Sipariş
                </p>
                <h1 className="text-xl sm:text-2xl font-bold font-mono text-cyan-200/95 break-all">
                  {order.id}
                </h1>
                <p className="text-xs text-violet-300/50 mt-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <span
                className={`text-xs px-3 py-1.5 rounded-full border font-medium shrink-0 ${ORDER_STATUS_COLORS[order.status]}`}
              >
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>

            <div className="space-y-4 text-sm text-violet-100/85 border-t border-white/10 pt-6">
              <div className="flex gap-3">
                <User className="w-4 h-4 text-cyan-400/70 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-violet-300/50">
                    İsim
                  </p>
                  <p>{order.customerName}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="w-4 h-4 text-cyan-400/70 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-violet-300/50">
                    Telefon
                  </p>
                  <p>{order.phone}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-cyan-400/70 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-violet-300/50">
                    Teslimat adresi
                  </p>
                  <p className="leading-relaxed">{order.address}</p>
                </div>
              </div>
              {order.note ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-violet-200/75">
                  <p className="text-[11px] uppercase tracking-wide text-violet-300/50 mb-1">
                    Sipariş notu
                  </p>
                  <p>{order.note}</p>
                </div>
              ) : null}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-4 h-4 text-fuchsia-300/80" />
                <h2 className="font-semibold text-white/95">Ürünler</h2>
              </div>
              <ul className="space-y-3">
                {order.items.map((line, idx) => (
                  <li
                    key={`${line.productId}-${idx}`}
                    className="flex flex-wrap justify-between gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5 text-sm"
                  >
                    <span className="text-violet-100/90 min-w-0 flex-1">
                      {line.productName}{" "}
                      <span className="text-violet-300/55">
                        × {line.quantity}
                      </span>
                    </span>
                    <span className="font-medium text-neon shrink-0">
                      {formatPrice(line.price * line.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 glass rounded-xl p-4 border border-white/10">
              <OrderTotalsSummary
                subtotal={totals.subtotal}
                totals={totals}
                showFreeShippingHint={false}
              />
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
