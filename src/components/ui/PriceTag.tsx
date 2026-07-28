import { formatPrice, calculateDiscount } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  compareAtPrice?: number | null;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
};

/** Muestra el precio actual y, si existe, el precio tachado + % de descuento. */
export function PriceTag({ price, compareAtPrice, size = "md" }: PriceTagProps) {
  const discount = calculateDiscount(price, compareAtPrice);

  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-semibold text-brand-black ${SIZE_CLASSES[size]}`}>
        {formatPrice(price)}
      </span>
      {discount > 0 && compareAtPrice ? (
        <>
          <span className="text-sm text-brand-gray-400 line-through">
            {formatPrice(compareAtPrice)}
          </span>
          <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-xs font-semibold text-brand-blue">
            -{discount}%
          </span>
        </>
      ) : null}
    </div>
  );
}
