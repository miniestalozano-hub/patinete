import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, Wrench } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { getFeaturedProducts, getCategoryTree } from "@/lib/products";

export const revalidate = 3600; // ISR: la home se regenera cada hora

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategoryTree(),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-brand-black text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,102,255,0.25),transparent_60%)]" />
        <div className="container-premium relative z-10 py-24">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-brand-blue-light animate-fade-in">
            Rendimiento. Precision. Compatibilidad total.
          </p>
          <h1 className="max-w-2xl text-balance text-5xl font-semibold leading-tight sm:text-6xl md:text-7xl animate-fade-up">
            Tu patinete, siempre a punto.
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg text-brand-gray-300 animate-fade-up [animation-delay:150ms]">
            Recambios y accesorios originales y compatibles para las marcas mas
            usadas del mercado, verificados pieza a pieza.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 animate-fade-up [animation-delay:300ms]">
            <Link href="/catalogo" className="btn-primary">
              Ver catalogo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/buscar"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white"
            >
              Buscar por modelo
            </Link>
          </div>
        </div>
      </section>

      {/* CONFIANZA */}
      <section className="border-b border-brand-gray-200 bg-brand-off-white">
        <div className="container-premium grid grid-cols-1 gap-8 py-12 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Compatibilidad garantizada", text: "Cada pieza indica los modelos exactos con los que encaja." },
            { icon: Truck, title: "Envio rapido", text: "Preparamos tu pedido en 24-48h laborables." },
            { icon: Wrench, title: "Soporte tecnico", text: "Te ayudamos a elegir la pieza correcta para tu patinete." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-black text-white">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-brand-gray-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIAS */}
      {categories.length > 0 && (
        <section className="container-premium py-20">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-3xl font-semibold">Compra por categoria</h2>
            <Link href="/catalogo" className="link-underline text-sm font-medium text-brand-gray-600">
              Ver todas
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogo/${cat.slug}`}
                className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl2 bg-brand-gray-900"
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover opacity-80 transition-transform duration-500 ease-premium group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-gray-800 to-brand-black" />
                )}
                <div className="relative z-10 p-5">
                  <span className="text-lg font-semibold text-white">{cat.name}</span>
                  <span className="mt-1 block h-[2px] w-8 bg-brand-blue transition-all duration-300 group-hover:w-16" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* DESTACADOS */}
      {featuredProducts.length > 0 && (
        <section className="bg-brand-off-white py-20">
          <div className="container-premium">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="text-3xl font-semibold">Productos destacados</h2>
              <Link href="/catalogo" className="link-underline text-sm font-medium text-brand-gray-600">
                Ver todo
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 4} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
