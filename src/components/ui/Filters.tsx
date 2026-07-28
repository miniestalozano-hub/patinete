"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { VOLTAGE_OPTIONS, SORT_OPTIONS } from "@/lib/constants";

interface FiltersProps {
  brands: string[];
}

/**
 * Filtros del catalogo. Todo el estado vive en la URL (search params),
 * lo que permite compartir enlaces filtrados y mantiene la logica de
 * datos en el Server Component de la pagina (sin duplicar fetch en cliente).
 */
export function Filters({ brands }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page"); // cualquier cambio de filtro reinicia la paginacion
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleListParam(key: string, value: string) {
    const current = searchParams.get(key)?.split(",").filter(Boolean) ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParam(key, next.length > 0 ? next.join(",") : null);
  }

  const activeBrands = searchParams.get("brands")?.split(",").filter(Boolean) ?? [];
  const activeVoltage = searchParams.get("voltage")?.split(",").filter(Boolean) ?? [];

  return (
    <aside className="flex flex-col gap-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Ordenar por</h3>
        <select
          value={searchParams.get("sort") ?? "relevance"}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full rounded-lg border border-brand-gray-200 bg-white px-3 py-2 text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Disponibilidad</h3>
        <label className="flex items-center gap-2 text-sm text-brand-gray-600">
          <input
            type="checkbox"
            checked={searchParams.get("stock") === "1"}
            onChange={(e) => updateParam("stock", e.target.checked ? "1" : null)}
            className="h-4 w-4 rounded border-brand-gray-300 text-brand-blue focus:ring-brand-blue"
          />
          Solo productos en stock
        </label>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Precio (€)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            defaultValue={searchParams.get("minPrice") ?? ""}
            onBlur={(e) => updateParam("minPrice", e.target.value || null)}
            className="w-full rounded-lg border border-brand-gray-200 px-3 py-2 text-sm"
          />
          <span className="text-brand-gray-400">-</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            defaultValue={searchParams.get("maxPrice") ?? ""}
            onBlur={(e) => updateParam("maxPrice", e.target.value || null)}
            className="w-full rounded-lg border border-brand-gray-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {brands.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold">Marca</h3>
          <div className="flex flex-col gap-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 text-sm text-brand-gray-600">
                <input
                  type="checkbox"
                  checked={activeBrands.includes(brand)}
                  onChange={() => toggleListParam("brands", brand)}
                  className="h-4 w-4 rounded border-brand-gray-300 text-brand-blue focus:ring-brand-blue"
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold">Voltaje</h3>
        <div className="flex flex-wrap gap-2">
          {VOLTAGE_OPTIONS.map((v) => (
            <button
              key={v}
              onClick={() => toggleListParam("voltage", String(v))}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                activeVoltage.includes(String(v))
                  ? "border-brand-black bg-brand-black text-white"
                  : "border-brand-gray-300 text-brand-gray-600 hover:border-brand-black"
              }`}
            >
              {v}V
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => router.push(pathname)}
        className="text-left text-sm font-medium text-brand-blue hover:underline"
      >
        Limpiar filtros
      </button>
    </aside>
  );
}
