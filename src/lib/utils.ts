import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina clases de Tailwind evitando conflictos (patron estandar shadcn/ui). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatea un numero como precio en euros: 199.99 -> "199,99 €" */
export function formatPrice(value: number | string): string {
  const numeric = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(numeric);
}

/** Calcula el porcentaje de descuento entre precio original y precio actual. */
export function calculateDiscount(price: number, compareAtPrice?: number | null): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/** Genera un slug URL-friendly a partir de un texto ("Xiaomi Pro 2" -> "xiaomi-pro-2"). */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Genera un numero de pedido legible, ej: PS-2026-000123 */
export function generateOrderNumber(sequence: number): string {
  const year = new Date().getFullYear();
  return `PS-${year}-${String(sequence).padStart(6, "0")}`;
}

/** Trunca un texto a N caracteres, respetando palabras completas. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, text.lastIndexOf(" ", maxLength)) + "…";
}

/** Debounce simple para inputs de busqueda. */
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}
