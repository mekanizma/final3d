"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle, Home, Mail, Package, AlertCircle } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { OrderTotalsSummary } from "@/components/order/OrderTotalsSummary";
import { api } from "@/services";
import { formatDate } from "@/lib/utils";
import { resolveOrderTotals } from "@/lib/pricing";
import type { Order } from "@/types";

type EmailStatus = "sent" | "mock" | "failed" | null;

export function OrderSuccessClient({
  orderId,
  emailStatus,
}: {
  orderId: string | null;
  emailStatus: EmailStatus;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (orderId) api.getOrderById(orderId).then(setOrder);
  }, [orderId]);

  useEffect(() => {
    if (!fired.current) {
      fired.current = true;
      const duration = 2000;
      const end = Date.now() + duration;
      const colors = ["#e879f9", "#a855f7", "#22d3ee"];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }
  }, []);

  const totals = order ? resolveOrderTotals(order) : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg w-full mx-4"
    >
      <GlassCard hover={false} className="p-10 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </motion.div>

        <h1 className="text-2xl font-bold mb-2">Sipariş Alındı!</h1>
        <p className="text-violet-200/70 mb-4">
          Siparişiniz başarıyla oluşturuldu. En kısa sürede sizinle iletişime
          geçeceğiz.
        </p>

        {emailStatus === "sent" && (
          <p className="flex items-center justify-center gap-2 text-sm text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-2.5 mb-6">
            <Mail className="w-4 h-4 shrink-0" />
            Sipariş detayları e-posta adresinize gönderildi.
          </p>
        )}
        {emailStatus === "mock" && (
          <p className="flex items-center justify-center gap-2 text-sm text-amber-200/80 bg-amber-500/10 border border-amber-500/25 rounded-xl px-4 py-2.5 mb-6">
            <Mail className="w-4 h-4 shrink-0" />
            E-posta servisi yapılandırılmadı (geliştirme modu). Canlıda
            RESEND_API_KEY ile otomatik gönderilir.
          </p>
        )}
        {emailStatus === "failed" && (
          <p className="flex items-center justify-center gap-2 text-sm text-rose-300/90 bg-rose-500/10 border border-rose-500/25 rounded-xl px-4 py-2.5 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Onay e-postası gönderilemedi; siparişiniz kayıtlıdır.
          </p>
        )}

        {order && totals && (
          <div className="glass rounded-xl p-4 text-left mb-8 text-sm space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-violet-200/50">Sipariş No</span>
                <span className="font-mono text-cyan-300">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-violet-200/50">Tarih</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-violet-200/50">Ödeme</span>
                <span>Kapıda Ödeme</span>
              </div>
            </div>
            <div className="border-t border-white/10 pt-3">
              <OrderTotalsSummary
                subtotal={totals.subtotal}
                totals={totals}
                showFreeShippingHint={false}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <NeonButton>
              <Home className="w-4 h-4" />
              Ana Sayfa
            </NeonButton>
          </Link>
          <Link href="/urunler">
            <NeonButton variant="ghost">
              <Package className="w-4 h-4" />
              Alışverişe Devam
            </NeonButton>
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );
}
