/**
 * Constantes globales de la tienda.
 * Los modelos de patinete listados aqui son solo un punto de partida:
 * la fuente real de verdad es la tabla `scooter_models` en la base de datos,
 * que se puede ampliar desde el panel de administracion o el CSV de import.
 */

export const SITE_NAME = "Patin Shop";
export const SITE_DESCRIPTION =
  "Recambios, accesorios y compatibilidades premium para patinetes electricos.";

export const VOLTAGE_OPTIONS = [24, 36, 48, 52, 60, 72] as const;

export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevancia" },
  { value: "newest", label: "Novedades" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
] as const;

/** Marcas de patinete de referencia, usadas para sembrar la base de datos. */
export const SEED_SCOOTER_BRANDS = [
  "Xiaomi",
  "Kukirin",
  "Dualtron",
  "Segway-Ninebot",
  "Navee",
  "Zwheel",
  "Smartgyro",
] as const;

export const ADMIN_PAGE_SIZE = 25;
export const CATALOG_PAGE_SIZE = 24;
