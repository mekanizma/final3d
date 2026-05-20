"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Trash2 } from "lucide-react";
import { useOrderStore } from "@/store/orderStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { ORDER_STATUS_COLORS } from "@/lib/constants";
import { orderStatusLabel } from "@/lib/order-labels";
import { useIntl } from "@/components/i18n/IntlProvider";
import { tFormat } from "@/lib/t-format";
import { formatDate, formatPrice } from "@/lib/utils";
import { resolveOrderTotals } from "@/lib/pricing";
import { OrderTotalsSummary } from "@/components/order/OrderTotalsSummary";
import type { Order, OrderStatus } from "@/types";

const statuses: OrderStatus[] = [
  "yeni",
  "hazirlaniyor",
  "kargoda",
  "teslim-edildi",
];

export default function AdminOrdersPage() {
  const { t } = useIntl();
  const { orders, fetchOrders, updateOrderStatus, deleteOrder } =
    useOrderStore();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const filtered = orders
    .filter((o) => filter === "all" || o.status === filter)
    .filter(
      (o) =>
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        (o.userEmail?.toLowerCase().includes(search.toLowerCase()) ?? false)
    );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t("adminOrders.title")}</h1>
        <p className="text-violet-200/60 text-sm">
          {tFormat(t, "adminOrders.count", { count: String(orders.length) })}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs transition-all ${
            filter === "all"
              ? "bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white shadow-md"
              : "glass text-violet-100/80 hover:text-white"
          }`}
        >
          {t("adminOrders.all")}
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === s
                ? "bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white shadow-md"
                : "glass text-violet-100/80 hover:text-white"
            }`}
          >
            {orderStatusLabel(s, t)}
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-300/70 pointer-events-none"
          strokeWidth={2}
          aria-hidden
        />
        <input
          className="input-field pl-10"
          placeholder={t("adminOrders.searchPh")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GlassCard hover={false} className="overflow-hidden">
                <button
                  className="w-full p-4 flex items-center gap-4 text-left"
                  onClick={() =>
                    setExpanded(expanded === order.id ? null : order.id)
                  }
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{order.customerName}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${ORDER_STATUS_COLORS[order.status]}`}
                      >
                        {orderStatusLabel(order.status, t)}
                      </span>
                    </div>
                    <p className="text-xs text-violet-200/60 mt-1">
                      {order.id} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <p className="font-bold text-neon shrink-0">
                    {formatPrice(order.total)}
                  </p>
                  <ChevronDown
                    className={`w-4 h-4 text-violet-200/60 transition-transform shrink-0 ${
                      expanded === order.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {expanded === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5"
                    >
                      <OrderDetail
                        order={order}
                        onStatusChange={(status) =>
                          updateOrderStatus(order.id, status)
                        }
                        onDelete={() => {
                          if (
                            confirm(t("adminOrders.deleteConfirm"))
                          )
                            deleteOrder(order.id);
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center text-violet-200/60 py-12">{t("adminOrders.notFound")}</p>
        )}
      </div>
    </div>
  );
}

function OrderDetail({
  order,
  onStatusChange,
  onDelete,
}: {
  order: Order;
  onStatusChange: (status: OrderStatus) => void;
  onDelete: () => void;
}) {
  const { t } = useIntl();
  const totals = resolveOrderTotals(order);

  return (
    <div className="p-4 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        {order.userEmail && (
          <div>
            <p className="text-violet-200/60 mb-1">{t("adminOrders.accountEmail")}</p>
            <p>{order.userEmail}</p>
          </div>
        )}
        <div>
          <p className="text-violet-200/60 mb-1">{t("adminRequests.phone")}</p>
          <p>{order.phone}</p>
        </div>
        <div>
          <p className="text-violet-200/60 mb-1">{t("adminOrders.address")}</p>
          <p>{order.address}</p>
        </div>
      </div>

      {order.note && (
        <div className="text-sm">
          <p className="text-violet-200/60 mb-1">{t("adminOrders.note")}</p>
          <p className="glass rounded-lg p-3">{order.note}</p>
        </div>
      )}

      <div>
        <p className="text-violet-200/60 text-sm mb-2">{t("adminOrders.items")}</p>
        {order.items.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between text-sm py-1 border-b border-white/5"
          >
            <span>
              {item.productName} x{item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-4">
        <p className="text-violet-200/60 text-sm mb-3">{t("adminOrders.paymentSummary")}</p>
        <OrderTotalsSummary
          subtotal={totals.subtotal}
          totals={totals}
          showFreeShippingHint={false}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-violet-200/70">{t("adminOrders.statusLabel")}:</p>
        <StatusSelect value={order.status} onChange={onStatusChange} />
        <button
          onClick={onDelete}
          className="ml-auto p-2 text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-1 text-sm"
        >
          <Trash2 className="w-4 h-4" />
          {t("adminOrders.deleteBtn")}
        </button>
      </div>
    </div>
  );
}
