import type {
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ProductCategory,
  UserPublic,
} from "@/types";
import type { CustomPrintRequest } from "@/services/customPrintService";
import type { ScanQuoteRequest } from "@/services/scanRequestService";

export type DbProduct = {
  id: string;
  name: string;
  description: string;
  translations: Product["translations"] | Record<string, unknown>;
  price: number | string;
  stock: number;
  image: string;
  images?: string[] | null;
  category: ProductCategory;
  featured: boolean;
  created_at: string;
};

export function resolveProductImages(row: {
  image: string;
  images?: string[] | null;
}): string[] {
  const fromCol = Array.isArray(row.images)
    ? row.images.map((u) => String(u).trim()).filter(Boolean)
    : [];
  if (fromCol.length > 0) return fromCol;
  const cover = row.image?.trim();
  return cover ? [cover] : [];
}

export type DbOrder = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  items: OrderItem[];
  note: string | null;
  payment_method: string;
  status: OrderStatus;
  subtotal: number | string | null;
  shipping_fee: number | string | null;
  total: number | string;
  user_id: string | null;
  user_email: string | null;
  created_at: string;
};

export type DbProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
};

export function mapProduct(row: DbProduct): Product {
  const images = resolveProductImages(row);
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    translations: row.translations as Product["translations"],
    price: Number(row.price),
    stock: row.stock,
    image: images[0] ?? row.image,
    images,
    category: row.category,
    featured: row.featured,
    createdAt: row.created_at,
  };
}

export function mapOrder(row: DbOrder): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    address: row.address,
    items: row.items ?? [],
    note: row.note ?? undefined,
    paymentMethod: "kapida-odeme",
    status: row.status,
    subtotal: row.subtotal != null ? Number(row.subtotal) : undefined,
    shippingFee: row.shipping_fee != null ? Number(row.shipping_fee) : undefined,
    total: Number(row.total),
    userId: row.user_id ?? undefined,
    userEmail: row.user_email ?? undefined,
    createdAt: row.created_at,
  };
}

export function mapProfile(row: DbProfile): UserPublic {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    createdAt: row.created_at,
  };
}

export function productToDb(
  input: Partial<Product> &
    Pick<Product, "name" | "description" | "price" | "stock" | "image" | "category"> & {
      images?: string[];
    }
) {
  const images = resolveProductImages({
    image: input.image,
    images: input.images,
  });
  return {
    name: input.name,
    description: input.description,
    translations: input.translations ?? {},
    price: input.price,
    stock: input.stock,
    image: images[0] ?? input.image,
    images,
    category: input.category,
    featured: input.featured ?? false,
  };
}

export function mapCustomPrint(row: Record<string, unknown>): CustomPrintRequest {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: row.phone as string,
    material: row.material as CustomPrintRequest["material"],
    color: row.color as string,
    quantity: row.quantity as string,
    note: (row.note as string) ?? "",
    fileName: row.file_name as string,
    fileSize: Number(row.file_size),
    fileStoragePath: (row.file_storage_path as string) ?? undefined,
    userId: (row.user_id as string) ?? undefined,
    status: row.status as CustomPrintRequest["status"],
    createdAt: row.created_at as string,
  };
}

export function mapScanQuote(row: Record<string, unknown>): ScanQuoteRequest {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: row.phone as string,
    objectDescription: row.object_description as string,
    scanArea: row.scan_area as string,
    quantity: row.quantity as string,
    locationType: row.location_type as ScanQuoteRequest["locationType"],
    locationAddress: row.location_address as string,
    city: row.city as string,
    purpose: row.purpose as ScanQuoteRequest["purpose"],
    surfaceType: row.surface_type as ScanQuoteRequest["surfaceType"],
    wantsPrint: Boolean(row.wants_print),
    note: (row.note as string) ?? "",
    photoFileName: (row.photo_file_name as string) ?? undefined,
    photoFileSize: row.photo_file_size != null ? Number(row.photo_file_size) : undefined,
    photoStoragePath: (row.photo_storage_path as string) ?? undefined,
    userId: (row.user_id as string) ?? undefined,
    status: row.status as ScanQuoteRequest["status"],
    createdAt: row.created_at as string,
  };
}
