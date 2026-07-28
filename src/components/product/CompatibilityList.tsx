import Link from "next/link";
import type { ScooterModel } from "@prisma/client";

interface CompatibilityListProps {
  models: ScooterModel[];
}

/** Muestra los modelos de patinete con los que el producto es compatible. */
export function CompatibilityList({ models }: CompatibilityListProps) {
  if (models.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold">Compatible con</h3>
      <div className="flex flex-wrap gap-2">
        {models.map((model) => (
          <Link
            key={model.id}
            href={`/catalogo?compatibleModel=${model.slug}`}
            className="rounded-full border border-brand-gray-300 px-3 py-1.5 text-xs font-medium text-brand-gray-700 transition-colors hover:border-brand-blue hover:text-brand-blue"
          >
            {model.brand} {model.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
