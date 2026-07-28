import { PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

/**
 * Datos de EJEMPLO para poder arrancar y ver la tienda funcionando en local.
 * Sustituye esto por tu propio catalogo real usando el importador CSV del
 * panel de administracion (/admin/productos -> Importar CSV).
 */
async function main() {
  console.log("Sembrando datos de ejemplo...");

  // --- Categorias y subcategorias ---
  const categoriasData = [
    { name: "Baterias", sub: ["Baterias de repuesto", "Cargadores"] },
    { name: "Neumaticos y camaras", sub: ["Neumaticos tubeless", "Camaras", "Macizos"] },
    { name: "Frenos", sub: ["Pastillas", "Discos", "Cables"] },
    { name: "Accesorios", sub: ["Luces", "Timbres", "Soportes de movil"] },
    { name: "A medida", sub: [] },
    { name: "Repuestos electronicos", sub: ["Controladoras", "Displays", "Motores"] },
  ];

  const categories = [];
  for (const [i, cat] of categoriasData.entries()) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(cat.name) },
      update: {},
      create: { name: cat.name, slug: slugify(cat.name), order: i },
    });
    categories.push(category);

    for (const [j, subName] of cat.sub.entries()) {
      await prisma.subcategory.upsert({
        where: { slug: slugify(`${cat.name}-${subName}`) },
        update: {},
        create: {
          name: subName,
          slug: slugify(`${cat.name}-${subName}`),
          categoryId: category.id,
          order: j,
        },
      });
    }
  }

  // --- Marcas de producto ---
  const brandNames = ["Xiaomi", "Kukirin", "Dualtron", "Segway-Ninebot", "Navee", "Generico"];
  const brands = [];
  for (const name of brandNames) {
    const brand = await prisma.brand.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name) },
    });
    brands.push(brand);
  }

  // --- Modelos de patinete (para compatibilidad) ---
  const scooterModelsData = [
    { brand: "Xiaomi", name: "Pro 2" },
    { brand: "Xiaomi", name: "Essential" },
    { brand: "Xiaomi", name: "4 Pro" },
    { brand: "Kukirin", name: "G2 Max" },
    { brand: "Dualtron", name: "Mini" },
    { brand: "Segway-Ninebot", name: "Max G30" },
    { brand: "Navee", name: "N65" },
  ];
  const scooterModels = [];
  for (const m of scooterModelsData) {
    const model = await prisma.scooterModel.upsert({
      where: { slug: slugify(`${m.brand}-${m.name}`) },
      update: {},
      create: { name: m.name, brand: m.brand, slug: slugify(`${m.brand}-${m.name}`) },
    });
    scooterModels.push(model);
  }

  // --- Un producto de ejemplo por categoria ---
  const bateriasCategory = categories.find((c) => c.name === "Baterias")!;

  await prisma.product.upsert({
    where: { sku: "BAT-EJ-001" },
    update: {},
    create: {
      sku: "BAT-EJ-001",
      name: "Bateria de repuesto 36V 7.8Ah (producto de ejemplo)",
      slug: slugify("Bateria de repuesto 36V 7.8Ah ejemplo"),
      brandId: brands[0].id,
      categoryId: bateriasCategory.id,
      description:
        "Producto de EJEMPLO generado por el seed inicial. Sustituyelo por tu catalogo real usando el panel de administracion o la importacion CSV.",
      shortDescription: "Bateria compatible de repuesto, alta capacidad.",
      price: 129.99,
      compareAtPrice: 159.99,
      stock: 25,
      weightGrams: 2100,
      voltage: 36,
      powerWatts: 280,
      status: "PUBLISHED",
      isFeatured: true,
      images: {
        create: [{ url: "https://placehold.co/800x800/0A0A0B/FFFFFF?text=Bateria", order: 0 }],
      },
      compatibleWith: {
        connect: [{ id: scooterModels[0].id }, { id: scooterModels[1].id }],
      },
    },
  });

  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
