import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

/**
 * Genera el sitemap.xml combinando las paginas estaticas con todas las
 * categorias, subcategorias y productos publicados. Al escalar a miles
 * de productos, considera dividir esto en varios sitemaps (sitemap index).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/catalogo",
    "/contacto",
    "/faq",
    "/privacidad",
    "/condiciones",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
  }));

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      take: 5000, // limite de seguridad; para catalogos mayores, paginar en varios sitemaps
    }),
  ]);

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/catalogo/${c.slug}`,
    changeFrequency: "weekly",
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/producto/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
