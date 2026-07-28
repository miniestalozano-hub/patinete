"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@prisma/client";

interface ImageViewerProps {
  images: ProductImage[];
  productName: string;
}

/**
 * Visor de producto:
 * - Si hay varias imagenes con "angle" definido, permite arrastrar para
 *   simular una vista 360°/pseudo-3D (como en fichas tecnicas premium).
 * - Si solo hay una imagen (o ninguna con angulo), se comporta como una
 *   galeria clasica con miniaturas.
 */
export function ImageViewer({ images, productName }: ImageViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dragState = useRef<{ startX: number; startIndex: number } | null>(null);
  const has360 = images.filter((img) => img.angle !== null).length >= 4;

  function handlePointerDown(e: React.PointerEvent) {
    if (!has360) return;
    dragState.current = { startX: e.clientX, startIndex: activeIndex };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!has360 || !dragState.current) return;
    const deltaX = e.clientX - dragState.current.startX;
    // Cada 15px de arrastre avanza una imagen del set de 360°.
    const framesMoved = Math.round(deltaX / 15);
    const nextIndex =
      (((dragState.current.startIndex - framesMoved) % images.length) + images.length) %
      images.length;
    setActiveIndex(nextIndex);
  }

  function handlePointerUp() {
    dragState.current = null;
  }

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl2 bg-brand-gray-100 text-brand-gray-400">
        Sin imagenes disponibles
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={cn(
          "relative aspect-square w-full select-none overflow-hidden rounded-xl2 bg-brand-gray-100",
          has360 && "cursor-grab active:cursor-grabbing"
        )}
      >
        <Image
          src={images[activeIndex].url}
          alt={images[activeIndex].altText ?? productName}
          fill
          priority
          draggable={false}
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="pointer-events-none object-cover"
        />
        {has360 && (
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
            Arrastra para rotar 360°
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                i === activeIndex ? "border-brand-blue" : "border-transparent"
              )}
            >
              <Image src={img.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
