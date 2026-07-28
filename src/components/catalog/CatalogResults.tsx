import { ProductCard } from "@/components/ui/ProductCard";
import { Filters } from "@/components/ui/Filters";
import { Pagination } from "@/components/ui/Pagination";
import { getAvailableBrands } from "@/lib/products";
import type { ProductCardData } from "@/types";

interface CatalogResultsProps {
  title: string;
  description?: string;
  products: ProductCardData[];
  total: number;
  page: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}

/**
 * Estructura comun (titulo + filtros + grid + paginacion) que comparten
 * /catalogo, /catalogo/[categoria] y /catalogo/[categoria]/[subcategoria].
 */
export async function CatalogResults({
  title,
  description,
  products,
  total,
  page,
  totalPages,
  basePath,
  searchParams,
}: CatalogResultsProps) {
  const brands = await getAvailableBrands();

  return (
    <div className="container-premium py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-brand-gray-500">{description}</p>}
        <p className="mt-2 text-sm text-brand-gray-400">{total} productos encontrados</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <Filters brands={brands.map((b) => b.slug)} />

        <div>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-brand-gray-300 py-24 text-center">
              <p className="text-lg font-medium">No hay productos con estos filtros</p>
              <p className="mt-2 text-sm text-brand-gray-500">
                Prueba a quitar algun filtro o busca otra categoria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={basePath}
            searchParams={searchParams}
          />
        </div>
      </div>
    </div>
  );
}
