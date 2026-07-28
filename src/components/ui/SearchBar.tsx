"use client";

import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  initialValue?: string;
  onClose?: () => void;
  autoFocus?: boolean;
}

/**
 * Buscador global. Busca por nombre, marca, SKU y modelo compatible
 * (la logica de coincidencia vive en la API /api/products).
 */
export function SearchBar({ initialValue = "", onClose, autoFocus }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length === 0) return;
    router.push(`/buscar?q=${encodeURIComponent(trimmed)}`);
    onClose?.();
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray-400" />
      <input
        type="search"
        value={query}
        autoFocus={autoFocus}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por producto, marca, SKU o modelo compatible..."
        className="w-full rounded-full border border-brand-gray-200 bg-brand-gray-100 py-3 pl-11 pr-11 text-sm outline-none transition-colors focus:border-brand-blue focus:bg-white"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Limpiar busqueda"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray-400 hover:text-brand-black"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
