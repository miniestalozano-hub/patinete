import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCatalogProducts, getAllCategoryParams } from "@/lib/products";
import { parseCatalogFilters, flattenSearchParams } from "@/lib/parse-filters";
import { CatalogResults } from "@/components/catalog/CatalogResults";

interface PageProps {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams() {
  const allParams = await getAllCategoryParams();
  // Solo devolvemos los que tienen categoria pero NO subcategoria (ya que esta ruta es solo para categoria)
  return allParams.filter(p => !p.subcategoria).map(p => ({ categoria: p.categoria }));
}

async function getCategory(slug: string) {
  return prisma.category.findUnique({ where: { slug, isActive: true } });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoria } = await params;
  const category = await getCategory(categoria);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description ?? `Compra ${category.name.toLowerCase()} para tu patinete electrico.`,
  };
}

export default async function CategoriaPage({ params, searchParams }: PageProps) {
  const { categoria } = await params;
  const category = await getCategory(categoria);
  if (!category) notFound();

  const rawParams = await searchParams;
  const filters = parseCatalogFilters(rawParams, { categorySlug: categoria });
  const { products, total, page, totalPages } = await getCatalogProducts(filters);

  return (
    <CatalogResults
      title={category.name}
      description={category.description ?? undefined}
      products={products}
      total={total}
      page={page}
      totalPages={totalPages}
      basePath={`/catalogo/${categoria}`}
      searchParams={flattenSearchParams(rawParams)}
    />
  );
}
