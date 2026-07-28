import type { Metadata } from "next";
import { getCatalogProducts } from "@/lib/products";
import { parseCatalogFilters, flattenSearchParams } from "@/lib/parse-filters";
import { CatalogResults } from "@/components/catalog/CatalogResults";

export const metadata: Metadata = {
  title: "Resultados de busqueda",
  robots: { index: false }, // las paginas de busqueda no aportan valor SEO propio
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BuscarPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const query = typeof rawParams.q === "string" ? rawParams.q : "";
  const filters = parseCatalogFilters(rawParams, { search: query });
  const { products, total, page, totalPages } = await getCatalogProducts(filters);

  return (
    <CatalogResults
      title={query ? `Resultados para "${query}"` : "Busqueda"}
      description="Busca por nombre de producto, marca, SKU o modelo de patinete compatible."
      products={products}
      total={total}
      page={page}
      totalPages={totalPages}
      basePath="/buscar"
      searchParams={flattenSearchParams(rawParams)}
    />
  );
}
