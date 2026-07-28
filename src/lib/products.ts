import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CATALOG_PAGE_SIZE } from "@/lib/constants";
import type { CatalogFilters, ProductCardData } from "@/types";

/**
 * Convierte los filtros recibidos desde la URL (searchParams) en un
 * "where" de Prisma. Centralizar esto evita duplicar logica entre
 * el catalogo, el buscador y las paginas de categoria/subcategoria.
 */
function buildWhere(filters: CatalogFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { status: "PUBLISHED" };

  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug };
  }
  if (filters.subcategorySlug) {
    where.subcategory = { slug: filters.subcategorySlug };
  }
  if (filters.brands && filters.brands.length > 0) {
    where.brand = { slug: { in: filters.brands } };
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
    };
  }
  if (filters.voltage && filters.voltage.length > 0) {
    where.voltage = { in: filters.voltage };
  }
  if (filters.inStockOnly) {
    where.stock = { gt: 0 };
  }
  if (filters.compatibleModel) {
    where.compatibleWith = { some: { slug: filters.compatibleModel } };
  }
  if (filters.search) {
    const q = filters.search;
    // Busca por nombre, marca, SKU y modelo compatible (segun lo pedido).
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
      { brand: { name: { contains: q, mode: "insensitive" } } },
      { compatibleWith: { some: { name: { contains: q, mode: "insensitive" } } } },
    ];
  }

  return where;
}

function buildOrderBy(sort?: CatalogFilters["sort"]): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    case "newest":
      return { createdAt: "desc" };
    default:
      return { isFeatured: "desc" };
  }
}

/** Selecciona solo los campos necesarios para pintar una tarjeta de producto. */
const cardSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  compareAtPrice: true,
  stock: true,
  isFeatured: true,
  brand: { select: { name: true } },
  images: { select: { url: true }, orderBy: { order: "asc" as const }, take: 1 },
} satisfies Prisma.ProductSelect;

function toCardData(product: Prisma.ProductGetPayload<{ select: typeof cardSelect }>): ProductCardData {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    stock: product.stock,
    brand: product.brand?.name ?? null,
    image: product.images[0]?.url ?? null,
    isFeatured: product.isFeatured,
  };
}

/** Devuelve productos paginados segun los filtros del catalogo. */
export async function getCatalogProducts(filters: CatalogFilters) {
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const where = buildWhere(filters);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: cardSelect,
      orderBy: buildOrderBy(filters.sort),
      skip: (page - 1) * CATALOG_PAGE_SIZE,
      take: CATALOG_PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map(toCardData),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / CATALOG_PAGE_SIZE)),
  };
}

/** Productos destacados para la home. */
export async function getFeaturedProducts(limit = 8) {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    select: cardSelect,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(toCardData);
}

/** Obtiene un producto completo por su slug, con todas sus relaciones. */
export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
      subcategory: true,
      brand: true,
      compatibleWith: true,
    },
  });
}

/** Productos relacionados: primero los curados manualmente, luego por categoria. */
export async function getRelatedProducts(productId: string, categoryId: string, limit = 8) {
  const curated = await prisma.product.findMany({
    where: { relatedFrom: { some: { productId } }, status: "PUBLISHED" },
    select: cardSelect,
    take: limit,
  });

  if (curated.length >= limit) return curated.map(toCardData);

  const fallback = await prisma.product.findMany({
    where: {
      categoryId,
      status: "PUBLISHED",
      id: { not: productId, notIn: curated.map((p) => p.id) },
    },
    select: cardSelect,
    take: limit - curated.length,
  });

  return [...curated, ...fallback].map(toCardData);
}

/** Lista de marcas presentes en el catalogo, para pintar el filtro. */
export async function getAvailableBrands() {
  const brands = await prisma.brand.findMany({
    where: { products: { some: { status: "PUBLISHED" } } },
    select: { name: true, slug: true },
    orderBy: { name: "asc" },
  });
  return brands;
}

/** Arbol de categorias + subcategorias activas, para nav y home. */
export async function getCategoryTree() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: { subcategories: { where: { isActive: true }, orderBy: { order: "asc" } } },
  });
}

/** Obtiene todos los slugs de productos publicados para generacion estatica. */
export async function getAllProductSlugs() {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return products.map((p) => ({ slug: p.slug }));
}

/** Obtiene todas las combinaciones de categoria y subcategoria para generacion estatica. */
export async function getAllCategoryParams() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true, subcategories: { where: { isActive: true }, select: { slug: true } } },
  });

  const params: { categoria: string; subcategoria?: string }[] = [];

  categories.forEach((cat) => {
    // Solo categoria
    params.push({ categoria: cat.slug });
    // Categoria + Subcategoria
    cat.subcategories.forEach((sub) => {
      params.push({ categoria: cat.slug, subcategoria: sub.slug });
    });
  });

  return params;
}
