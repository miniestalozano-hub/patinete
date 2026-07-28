import type { CatalogFilters } from "@/types";

type RawSearchParams = Record<string, string | string[] | undefined>;

/** Convierte los searchParams crudos de una pagina en un objeto CatalogFilters tipado. */
export function parseCatalogFilters(
  searchParams: RawSearchParams,
  overrides: Partial<CatalogFilters> = {}
): CatalogFilters {
  const get = (key: string) => {
    const v = searchParams[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const brands = get("brands")?.split(",").filter(Boolean);
  const voltage = get("voltage")?.split(",").filter(Boolean).map(Number);

  return {
    brands,
    voltage,
    minPrice: get("minPrice") ? Number(get("minPrice")) : undefined,
    maxPrice: get("maxPrice") ? Number(get("maxPrice")) : undefined,
    inStockOnly: get("stock") === "1",
    search: get("q"),
    sort: (get("sort") as CatalogFilters["sort"]) ?? "relevance",
    page: get("page") ? Number(get("page")) : 1,
    ...overrides,
  };
}

/** Aplana los searchParams a Record<string,string> para pasarlos a componentes cliente. */
export function flattenSearchParams(searchParams: RawSearchParams): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    result[key] = Array.isArray(value) ? value[0] : value;
  }
  return result;
}
