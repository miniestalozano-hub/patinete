"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { SearchBar } from "@/components/ui/SearchBar";
import { SITE_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/catalogo", label: "Catalogo" },
  { href: "/catalogo/baterias", label: "Baterias" },
  { href: "/catalogo/neumaticos-y-camaras", label: "Neumaticos" },
  { href: "/catalogo/frenos", label: "Frenos" },
  { href: "/catalogo/accesorios", label: "Accesorios" },
];

/**
 * Cabecera fija con efecto "glass" al hacer scroll, navegacion principal,
 * buscador expandible y accesos a favoritos / carrito / cuenta.
 */
export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCart((s) => s.totalItems());
  const favoritesCount = useFavorites((s) => s.productIds.length);

  return (
    <header className="glass-nav sticky top-0 z-50 border-b border-brand-gray-200">
      <div className="container-premium flex h-16 items-center justify-between gap-4">
        <Link href="/" className="shrink-0 text-lg font-semibold tracking-tight">
          {SITE_NAME}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-sm font-medium text-brand-gray-600 hover:text-brand-black"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            aria-label="Buscar"
            onClick={() => setSearchOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-brand-gray-100"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link
            href="/favoritos"
            aria-label="Favoritos"
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-brand-gray-100"
          >
            <Heart className="h-5 w-5" />
            {favoritesCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-brand-blue text-[10px] font-semibold text-white">
                {favoritesCount}
              </span>
            )}
          </Link>

          <Link
            href="/carrito"
            aria-label="Carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-brand-gray-100"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-brand-blue text-[10px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          <Link
            href="/cuenta"
            aria-label="Mi cuenta"
            className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-brand-gray-100 sm:flex"
          >
            <User className="h-5 w-5" />
          </Link>

          <button
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-brand-gray-100 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-brand-gray-200 bg-white px-6 py-4 animate-fade-in">
          <div className="container-premium">
            <SearchBar autoFocus onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {mobileOpen && (
        <nav className="flex flex-col border-t border-brand-gray-200 bg-white px-6 py-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-brand-gray-100 py-3 text-sm font-medium last:border-none"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/cuenta" onClick={() => setMobileOpen(false)} className="py-3 text-sm font-medium">
            Mi cuenta
          </Link>
        </nav>
      )}
    </header>
  );
}
