"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "No se pudo iniciar el pago. Instalar Stripe y variables .env.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-premium flex flex-col items-center justify-center py-32 text-center">
        <ShoppingBag className="mb-4 h-12 w-12 text-brand-gray-300" />
        <h1 className="text-2xl font-semibold">Tu carrito esta vacio</h1>
        <p className="mt-2 text-brand-gray-500">Explora el catalogo y encuentra tu proxima pieza.</p>
        <Link href="/catalogo" className="btn-primary mt-6">
          Ir al catalogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container-premium py-12">
      <h1 className="mb-8 text-3xl font-semibold">Carrito</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <ul className="flex flex-col divide-y divide-brand-gray-200">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-6">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-brand-gray-100">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <Link href={`/producto/${item.slug}`} className="font-medium hover:text-brand-blue">
                    {item.name}
                  </Link>
                  <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-brand-gray-300">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    aria-label="Eliminar del carrito"
                    className="text-brand-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-xl2 border border-brand-gray-200 p-6">
          <h2 className="text-lg font-semibold">Resumen del pedido</h2>
          <div className="mt-4 flex justify-between text-sm text-brand-gray-500">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal())}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-brand-gray-500">
            <span>Envio</span>
            <span>Calculado en el pago</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-brand-gray-200 pt-4 text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(subtotal())}</span>
          </div>
          <Button onClick={handleCheckout} isLoading={loading} size="lg" className="mt-6 w-full">
            Finalizar compra
          </Button>
        </div>
      </div>
    </div>
  );
}
