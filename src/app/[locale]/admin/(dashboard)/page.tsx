"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Package, ShoppingBag, TrendingUp, Users, Calculator } from "lucide-react";
import Link from "next/link";
import { useProductStore } from "@/store/productStore";
import { useOrderStore } from "@/store/orderStore";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AdminDashboard() {
  const { products, fetchProducts } = useProductStore();
  const { orders, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    const interval = setInterval(() => {
      fetchProducts();
      fetchOrders();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchProducts, fetchOrders]);

  const newOrders = orders.filter((o) => o.status === "yeni").length;
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.stock <= 5).length;

  const stats = [
    {
      label: "Toplam Ürün",
      value: products.length,
      icon: Package,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Toplam Sipariş",
      value: orders.length,
      icon: ShoppingBag,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Yeni Siparişler",
      value: newOrders,
      icon: Users,
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Toplam Gelir",
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-violet-200/60 text-sm mb-8">
          Sistem özeti — canlı güncelleniyor
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard hover={false} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center opacity-80`}
                >
                  {(() => {
                    const StatIcon = stat.icon;
                    return (
                      <StatIcon
                        className="w-5 h-5 text-white"
                        strokeWidth={2}
                        aria-hidden
                      />
                    );
                  })()}
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-violet-200/70 mt-1">{stat.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <Link href="/admin/hesaplama" className="block mb-6">
        <GlassCard
          hover
          className="p-5 border-fuchsia-400/20 bg-gradient-to-r from-fuchsia-500/10 via-transparent to-cyan-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500/40 to-cyan-500/30 flex items-center justify-center shrink-0">
              <Calculator className="w-6 h-6 text-cyan-200" />
            </div>
            <div>
              <p className="font-semibold">Ücret Hesaplama</p>
              <p className="text-xs text-violet-200/60 mt-0.5">
                Filament + elektrik — baskı satış fiyatı
              </p>
            </div>
            <span className="ml-auto text-xs text-cyan-300/80 hidden sm:inline">
              Hesapla →
            </span>
          </div>
        </GlassCard>
      </Link>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Son Siparişler</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-blue-400 hover:underline"
            >
              Tümünü Gör
            </Link>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{order.customerName}</p>
                  <p className="text-xs text-violet-200/60">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-xs text-violet-200/60">
                    {ORDER_STATUS_LABELS[order.status]}
                  </p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-sm text-violet-200/60 text-center py-4">
                Henüz sipariş yok
              </p>
            )}
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Düşük Stok Uyarısı</h2>
            <Link
              href="/admin/products"
              className="text-xs text-blue-400 hover:underline"
            >
              Ürünleri Yönet
            </Link>
          </div>
          {lowStock === 0 ? (
            <p className="text-sm text-emerald-400 text-center py-8">
              ✓ Tüm ürünler yeterli stokta
            </p>
          ) : (
            <div className="space-y-3">
              {products
                .filter((p) => p.stock <= 5)
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between py-2 border-b border-white/5"
                  >
                    <p className="text-sm">{product.name}</p>
                    <span className="text-xs text-amber-400">
                      {product.stock} adet
                    </span>
                  </div>
                ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
