import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCatalogProducts, getAllCategoryParams } from "@/lib/products";
import { parseCatalogFilters, flattenSearchParams } from "@/lib/parse-filters";
import { CatalogResults } from "@/components/catalog/CatalogResults";

interface PageProps {
  params: Promise<{ categoria: string; subcategoria: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams() {
  const allParams = await getAllCategoryParams();
  // Solo devolvemos los que tienen AMBAS (categoria y subcategoria)
  return allParams.filter(p => p.subcategoria);
}

async function getSubcategory(categoria: string, subcategoria: string) {
  return prisma.subcategory.findFirst({
    where: { slug: subcategoria, isActive: true, category: { slug: categoria } },
    include: { category: true },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoria, subcategoria } = await params;
  const sub = await getSubcategory(categoria, subcategoria);
  if (!sub) return {};
  return {
    title: `${sub.name} · ${sub.category.name}`,
  };
}

export default async function SubcategoriaPage({ params, searchParams }: PageProps) {
  const { categoria, subcategoria } = await params;
  const sub = await getSubcategory(categoria, subcategoria);
  if (!sub) notFound();

  const rawParams = await searchParams;
  const filters = parseCatalogFilters(rawParams, {
    categorySlug: categoria,
    subcategorySlug: subcategoria,
  });
  const { products, total, page, totalPages } = await getCatalogProducts(filters);

  return (
    <CatalogResults
      title={sub.name}
      description={`Dentro de ${sub.category.name}`}
      products={products}
      total={total}
      page={page}
      totalPages={totalPages}
      basePath={`/catalogo/${categoria}/${subcategoria}`}
      searchParams={flattenSearchParams(rawParams)}
    />
  );
}
