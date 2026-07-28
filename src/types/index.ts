import type {
  Product,
  ProductImage,
  Category,
  Subcategory,
  Brand,
  ScooterModel,
  OrderStatus,
} from "@prisma/client";

/** Producto tal y como se sirve al frontend, con sus relaciones expandidas. */
export type ProductWithRelations = Product & {
  images: ProductImage[];
  category: Category;
  subcategory: Subcategory | null;
  brand: Brand | null;
  compatibleWith: ScooterModel[];
};

/** Version ligera de producto, usada en listados/tarjetas del catalogo. */
export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  brand: string | null;
  image: string | null;
  isFeatured: boolean;
};

/** Estructura de filtros que viaja entre la URL y las queries de Prisma. */
export type CatalogFilters = {
  categorySlug?: string;
  subcategorySlug?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  voltage?: number[];
  inStockOnly?: boolean;
  compatibleModel?: string;
  search?: string;
  sort?: "relevance" | "price-asc" | "price-desc" | "newest";
  page?: number;
};

/** Item del carrito en el cliente (Zustand), guarda lo minimo necesario. */
export type CartLineItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  quantity: number;
  stock: number;
};

/** Fila esperada al importar un CSV de productos desde el panel admin. */
export type ProductCsvRow = {
  sku: string;
  name: string;
  brand?: string;
  category: string;
  subcategory?: string;
  price: string;
  compareAtPrice?: string;
  stock: string;
  weightGrams?: string;
  voltage?: string;
  powerWatts?: string;
  description: string;
  shortDescription?: string;
  images?: string; // URLs separadas por "|"
  compatibleModels?: string; // nombres separados por "|"
  status?: string;
};

export type OrderStatusLabel = Record<OrderStatus, string>;
