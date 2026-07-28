import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getAllProductSlugs } from "@/lib/products";
import { ImageViewer } from "@/components/product/ImageViewer";
import { AddToCartForm } from "@/components/product/AddToCartForm";
import { CompatibilityList } from "@/components/product/CompatibilityList";
import { PriceTag } from "@/components/ui/PriceTag";
import { ProductCard } from "@/components/ui/ProductCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProductSlugs();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.shortDescription ?? undefined,
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
  };
}

export default async function ProductoPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "PUBLISHED") notFound();

  const related = await getRelatedProducts(product.id, product.categoryId, 8);

  const specs: { label: string; value: string }[] = [
    { label: "SKU", value: product.sku },
    ...(product.brand ? [{ label: "Marca", value: product.brand.name }] : []),
    ...(product.weightGrams ? [{ label: "Peso", value: `${product.weightGrams} g` }] : []),
    ...(product.voltage ? [{ label: "Voltaje", value: `${product.voltage} V` }] : []),
    ...(product.powerWatts ? [{ label: "Potencia", value: `${product.powerWatts} W` }] : []),
    { label: "Categoria", value: product.category.name },
    ...(product.subcategory ? [{ label: "Subcategoria", value: product.subcategory.name }] : []),
  ];

  return (
    <div className="container-premium py-12">
      {/* Migas de pan */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-brand-gray-400">
        <Link href="/catalogo" className="hover:text-brand-black">Catalogo</Link>
        <span>/</span>
        <Link href={`/catalogo/${product.category.slug}`} className="hover:text-brand-black">
          {product.category.name}
        </Link>
        {product.subcategory && (
          <>
            <span>/</span>
            <Link
              href={`/catalogo/${product.category.slug}/${product.subcategory.slug}`}
              className="hover:text-brand-black"
            >
              {product.subcategory.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ImageViewer images={product.images} productName={product.name} />

        <div className="flex flex-col gap-6">
          <div>
            {product.brand && (
              <span className="text-sm font-medium uppercase tracking-wide text-brand-gray-400">
                {product.brand.name}
              </span>
            )}
            <h1 className="mt-1 text-3xl font-semibold text-balance">{product.name}</h1>
            {product.shortDescription && (
              <p className="mt-2 text-brand-gray-500">{product.shortDescription}</p>
            )}
          </div>

          <PriceTag
            price={Number(product.price)}
            compareAtPrice={product.compareAtPrice ? Number(product.compareAtPrice) : null}
            size="lg"
          />

          <p className="text-sm text-brand-gray-500">
            {product.stock > 0
              ? `${product.stock} unidades disponibles`
              : "Actualmente sin stock"}
          </p>

          <AddToCartForm
            productId={product.id}
            name={product.name}
            slug={product.slug}
            price={Number(product.price)}
            image={product.images[0]?.url ?? null}
            stock={product.stock}
          />

          <CompatibilityList models={product.compatibleWith} />

          <div>
            <h3 className="mb-3 text-sm font-semibold">Descripcion</h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-brand-gray-600">
              {product.description}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Especificaciones</h3>
            <dl className="divide-y divide-brand-gray-200 rounded-xl2 border border-brand-gray-200">
              {specs.map((spec) => (
                <div key={spec.label} className="flex justify-between px-4 py-3 text-sm">
                  <dt className="text-brand-gray-500">{spec.label}</dt>
                  <dd className="font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-semibold">Tambien te puede interesar</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
