import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCatalogProducts } from "@/lib/products";
import { parseCatalogFilters } from "@/lib/parse-filters";

/**
 * GET /api/products
 * - ?ids=uuid1,uuid2  -> devuelve esos productos concretos (usado por favoritos)
 * - resto de query params -> reutiliza el mismo motor de filtros del catalogo
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (ids) {
    const idList = ids.split(",").filter(Boolean);
    const products = await prisma.product.findMany({
      where: { id: { in: idList }, status: "PUBLISHED" },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAtPrice: true,
        stock: true,
        isFeatured: true,
        brand: { select: { name: true } },
        images: { select: { url: true }, orderBy: { order: "asc" }, take: 1 },
      },
    });

    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        stock: p.stock,
        brand: p.brand?.name ?? null,
        image: p.images[0]?.url ?? null,
        isFeatured: p.isFeatured,
      })),
    });
  }

  const rawParams = Object.fromEntries(searchParams.entries());
  const filters = parseCatalogFilters(rawParams);
  const result = await getCatalogProducts(filters);
  return NextResponse.json(result);
}
