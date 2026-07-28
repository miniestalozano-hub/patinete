import type { Metadata } from "next";
import { getCatalogProducts } from "@/lib/products";
import { parseCatalogFilters, flattenSearchParams } from "@/lib/parse-filters";
import { CatalogResults } from "@/components/catalog/CatalogResults";

export const metadata: Metadata = {
  title: "Catalogo completo",
  description: "Explora todos los recambios y accesorios para patinetes electricos.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const filters = parseCatalogFilters(rawParams);
  const { products, total, page, totalPages } = await getCatalogProducts(filters);

  return (
    <CatalogResults
      title="Catalogo completo"
      description="Todas las piezas y accesorios disponibles, filtrables por marca, precio, voltaje y compatibilidad."
      products={products}
      total={total}
      page={page}
      totalPages={totalPages}
      basePath="/catalogo"
      searchParams={flattenSearchParams(rawParams)}
    />
  );
}
