import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

const FOOTER_COLUMNS = [
  {
    title: "Tienda",
    links: [
      { href: "/catalogo", label: "Catalogo completo" },
      { href: "/favoritos", label: "Favoritos" },
      { href: "/carrito", label: "Carrito" },
      { href: "/cuenta/pedidos", label: "Mis pedidos" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { href: "/contacto", label: "Contacto" },
      { href: "/faq", label: "Preguntas frecuentes" },
      { href: "/condiciones", label: "Envios y devoluciones" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacidad", label: "Politica de privacidad" },
      { href: "/condiciones", label: "Condiciones de venta" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-gray-200 bg-brand-black text-white">
      <div className="container-premium grid grid-cols-2 gap-10 py-16 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <span className="text-lg font-semibold">{SITE_NAME}</span>
          <p className="mt-3 text-sm text-brand-gray-400">
            Piezas y compatibilidades para tu patinete electrico, con la calidad
            de una tienda pensada para durar.
          </p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-white">{col.title}</h4>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-gray-400 transition-colors hover:text-brand-blue-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-premium flex flex-col items-center justify-between gap-2 text-xs text-brand-gray-500 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {SITE_NAME}. Todos los derechos reservados.
          </span>
          <span>Pagos seguros procesados por Stripe.</span>
        </div>
      </div>
    </footer>
  );
}
