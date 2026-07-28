"use client";

import { useState } from "react";
import { ShoppingCart, Check, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";

interface AddToCartFormProps {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  stock: number;
}

export function AddToCartForm({ productId, name, slug, price, image, stock }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const { isFavorite, toggleFavorite } = useFavorites();
  const outOfStock = stock <= 0;

  function handleAdd() {
    addItem({ productId, name, slug, price, image, stock }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      {!outOfStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-brand-gray-600">Cantidad</span>
          <div className="flex items-center rounded-full border border-brand-gray-300">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-9 w-9 items-center justify-center text-lg"
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
              className="flex h-9 w-9 items-center justify-center text-lg"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={handleAdd} disabled={outOfStock} size="lg" className="flex-1">
          {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
          {outOfStock ? "Agotado" : added ? "Añadido" : "Añadir al carrito"}
        </Button>
        <button
          onClick={() => toggleFavorite(productId)}
          aria-label="Añadir a favoritos"
          className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-brand-gray-300 transition-colors hover:border-brand-black"
        >
          <Heart
            className={isFavorite(productId) ? "h-5 w-5 fill-brand-blue text-brand-blue" : "h-5 w-5"}
          />
        </button>
      </div>
    </div>
  );
}
