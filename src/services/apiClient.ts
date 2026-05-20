import type {
  CreateOrderInput,
  CreateProductInput,
  LoginInput,
  Order,
  OrderStatus,
  Product,
  RegisterInput,
  UpdateProductInput,
  UpdateProfileInput,
  UserPublic,
} from "@/types";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || res.statusText);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return null as T;
  return JSON.parse(text) as T;
}

/** Supabase-backed API — mockDataService + mockAuthService yerine */
export const apiClient = {
  async getProducts(): Promise<Product[]> {
    return fetchJson<Product[]>("/api/products");
  },

  async getProductById(id: string): Promise<Product | null> {
    return fetchJson<Product | null>(`/api/products/${encodeURIComponent(id)}`);
  },

  async createProduct(input: CreateProductInput): Promise<Product> {
    return fetchJson<Product>("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    return fetchJson<Product>(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  async deleteProduct(id: string): Promise<void> {
    await fetchJson(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },

  async getOrders(): Promise<Order[]> {
    return fetchJson<Order[]>("/api/orders");
  },

  async getOrderById(id: string): Promise<Order | null> {
    return fetchJson<Order | null>(`/api/orders/${encodeURIComponent(id)}`);
  },

  async getOrdersByUserId(
    userId: string,
    _userEmail?: string
  ): Promise<Order[]> {
    void userId;
    return fetchJson<Order[]>("/api/orders/mine");
  },

  async createOrder(input: CreateOrderInput): Promise<Order> {
    return fetchJson<Order>("/api/orders", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    return fetchJson<Order>(`/api/admin/orders/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async deleteOrder(id: string): Promise<void> {
    await fetchJson(`/api/admin/orders/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },

  async resetData(): Promise<void> {
    throw new Error("resetData yalnızca mock ortamında kullanılabilir.");
  },

  async register(input: RegisterInput): Promise<UserPublic> {
    return fetchJson<UserPublic>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async login(input: LoginInput): Promise<UserPublic> {
    return fetchJson<UserPublic>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async logout(): Promise<void> {
    await fetchJson("/api/auth/logout", { method: "POST" });
  },

  async getCurrentUser(): Promise<UserPublic | null> {
    return fetchJson<UserPublic | null>("/api/auth/me");
  },

  async updateProfile(
    _userId: string,
    input: UpdateProfileInput
  ): Promise<UserPublic> {
    return fetchJson<UserPublic>("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },
};
