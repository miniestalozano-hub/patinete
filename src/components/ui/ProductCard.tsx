"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { PriceTag } from "./PriceTag";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import type { ProductCardData } from "@/types";

interface ProductCardProps {
  product: ProductCardData;
  priority?: boolean;
}

/**
 * Tarjeta de producto usada en catalogo, home, buscador y "relacionados".
 * Mantenerla como componente unico evita duplicar el marcado en cada pagina.
 */
export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);
  const outOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl2 border border-brand-gray-200 bg-white transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-premium-lg">
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(product.id);
        }}
        aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-transform duration-200 hover:scale-110"
      >
        <Heart
          className={cn("h-4 w-4 transition-colors", favorite ? "fill-brand-blue text-brand-blue" : "text-brand-gray-500")}
        />
      </button>

      <Link href={`/producto/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square w-full overflow-hidden bg-brand-gray-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority={priority}
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-brand-gray-300">
              Sin imagen
            </div>
          )}
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <span className="rounded-full bg-brand-black px-3 py-1 text-xs font-medium text-white">
                Agotado
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4">
          {product.brand && (
            <span className="text-xs font-medium uppercase tracking-wide text-brand-gray-400">
              {product.brand}
            </span>
          )}
          <h3 className="line-clamp-2 text-sm font-medium text-brand-black">{product.name}</h3>
          <div className="mt-auto pt-2">
            <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
          </div>
        </div>
      </Link>
    </div>
  );
}
