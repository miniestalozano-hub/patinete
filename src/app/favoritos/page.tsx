"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { ProductCard } from "@/components/ui/ProductCard";
import type { ProductCardData } from "@/types";

export default function FavoritosPage() {
  const { productIds } = useFavorites();
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/products?ids=${productIds.join(",")}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, [productIds]);

  if (!loading && products.length === 0) {
    return (
      <div className="container-premium flex flex-col items-center justify-center py-32 text-center">
        <Heart className="mb-4 h-12 w-12 text-brand-gray-300" />
        <h1 className="text-2xl font-semibold">Aun no tienes favoritos</h1>
        <p className="mt-2 text-brand-gray-500">
          Toca el corazon en cualquier producto para guardarlo aqui.
        </p>
        <Link href="/catalogo" className="btn-primary mt-6">
          Explorar catalogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container-premium py-12">
      <h1 className="mb-8 text-3xl font-semibold">Mis favoritos</h1>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
