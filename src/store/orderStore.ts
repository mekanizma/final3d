import { create } from "zustand";
import { api } from "@/services";
import type { CreateOrderInput, Order, OrderStatus } from "@/types";

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (input: CreateOrderInput) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const orders = await api.getOrders();
      set({ orders, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  createOrder: async (input) => {
    const order = await api.createOrder(input);
    set({ orders: [order, ...get().orders] });
    return order;
  },

  updateOrderStatus: async (id, status) => {
    const updated = await api.updateOrderStatus(id, status);
    set({
      orders: get().orders.map((o) => (o.id === id ? updated : o)),
    });
  },

  deleteOrder: async (id) => {
    await api.deleteOrder(id);
    set({ orders: get().orders.filter((o) => o.id !== id) });
  },
}));
