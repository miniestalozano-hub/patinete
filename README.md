# Patin Shop

Tienda online profesional de recambios y accesorios para patinetes electricos.
Construida con **Next.js 15 (App Router) + TypeScript + Tailwind CSS + Prisma + Supabase + Stripe**.

> Estado del proyecto: base funcional y escalable, lista para importar tu propio
> catalogo real. Consulta la seccion "Roadmap / pendiente" al final para ver que
> falta por completar (panel de administracion, webhook de Stripe, etc.).

## ✨ Funcionalidades incluidas

- Home, catalogo general, categorias y subcategorias dinamicas
- Buscador por nombre, marca, SKU y modelo de patinete compatible
- Filtros por marca, precio, voltaje y disponibilidad (via URL, compartibles)
- Ficha de producto con visor de imagenes tipo pseudo-3D (arrastrar para rotar)
- Carrito de la compra persistente (Zustand + localStorage)
- Favoritos persistentes
- Autenticacion de usuarios con Supabase (login / registro)
- Historial de pedidos
- Integracion con Stripe Checkout (sesion de pago creada en el servidor)
- SEO tecnico: metadata dinamica, `sitemap.xml` y `robots.txt` generados a partir
  del catalogo real
- Modelo de datos preparado para miles de productos, con compatibilidad
  N:N con modelos de patinete (Xiaomi, Kukirin, Dualtron, Segway, Navee, etc.)

## 🧱 Stack tecnico

| Capa            | Tecnologia                          |
|-----------------|--------------------------------------|
| Framework       | Next.js 15 (App Router, React 19)   |
| Lenguaje        | TypeScript                          |
| Estilos         | Tailwind CSS                        |
| Base de datos   | PostgreSQL (Supabase)               |
| ORM             | Prisma                              |
| Autenticacion   | Supabase Auth                       |
| Pagos           | Stripe Checkout                     |
| Estado cliente  | Zustand                             |
| Lint / formato  | ESLint + Prettier                   |

## 📁 Estructura de carpetas

```
patin-shop/
├── prisma/
│   ├── schema.prisma      # Modelo de datos completo
│   └── seed.ts            # Datos de ejemplo para desarrollo
├── public/                # Assets estaticos
└── src/
    ├── app/                # Rutas (App Router)
    │   ├── catalogo/[categoria]/[subcategoria]/
    │   ├── producto/[slug]/
    │   ├── carrito/  favoritos/  cuenta/  buscar/
    │   ├── contacto/ faq/ privacidad/ condiciones/
    │   └── api/            # Route Handlers (products, checkout...)
    ├── components/
    │   ├── layout/          # Header, Footer
    │   ├── ui/               # Button, ProductCard, Filters, etc.
    │   ├── product/          # ImageViewer, AddToCartForm...
    │   └── account/          # AuthForm, SignOutButton
    ├── hooks/                # useCart, useFavorites, useDebounce
    ├── lib/                  # prisma, supabase, stripe, utils, products.ts
    ├── types/                # Tipos compartidos
    └── middleware.ts         # Protege /admin y refresca sesion Supabase
```

## 🚀 Puesta en marcha local

### 1. Requisitos previos

- Node.js 18.18 o superior
- Una cuenta de [Supabase](https://supabase.com) (base de datos + auth)
- Una cuenta de [Stripe](https://stripe.com) (modo test es suficiente para desarrollar)

### 2. Clonar e instalar dependencias

```bash
git clone <tu-repositorio>
cd patin-shop
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Rellena `.env` con:

- `DATABASE_URL` y `DIRECT_URL`: desde Supabase → Project Settings → Database
- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`: desde Supabase → Project Settings → API
- `SUPABASE_SERVICE_ROLE_KEY`: idem (¡nunca la expongas en el cliente!)
- `STRIPE_SECRET_KEY` y `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: desde el Dashboard de Stripe
- `STRIPE_WEBHOOK_SECRET`: se genera al crear el webhook (ver mas abajo)

### 4. Crear las tablas en Supabase

```bash
npm run db:push
```

Esto sincroniza `prisma/schema.prisma` con tu base de datos Supabase.
Para proyectos en produccion, se recomienda usar migraciones versionadas:

```bash
npm run db:migrate
```

### 5. (Opcional) Cargar datos de ejemplo

```bash
npm run db:seed
```

Esto crea categorias, subcategorias, marcas, modelos de patinete y un
producto de ejemplo para poder ver la tienda funcionando. **Sustituye estos
datos por tu catalogo real** en cuanto el panel de administracion / import
CSV este disponible (ver Roadmap).

### 6. Arrancar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 💳 Configurar Stripe en local

1. Instala la [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Ejecuta:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
3. Copia el `whsec_...` que te devuelve en `STRIPE_WEBHOOK_SECRET`

> El endpoint `/api/webhooks/stripe` forma parte del roadmap pendiente (ver
> abajo); de momento el checkout crea la sesion de pago pero la confirmacion
> automatica del pedido (marcar como pagado, descontar stock) se completara
> en la siguiente iteracion.

## 🗄️ Modelo de datos (resumen)

- **Category / Subcategory**: jerarquia de categorias del catalogo
- **Brand**: marca del producto (no confundir con marca del patinete)
- **ScooterModel**: modelos de patinete (Xiaomi Pro 2, Kukirin G2 Max...) usados
  para la compatibilidad
- **Product**: producto con SKU, precio, stock, peso, voltaje, potencia,
  imagenes, compatibilidad y relaciones a productos relacionados
- **Cart / CartItem / Favorite**: estado de compra del usuario
- **Order / OrderItem**: pedidos ya confirmados

Consulta `prisma/schema.prisma` para el detalle completo de campos e indices.

## 🧩 Como importar tu propio catalogo real

El modelo `ProductCsvRow` (en `src/types/index.ts`) define el formato de fila
CSV esperado: `sku, name, brand, category, subcategory, price, stock,
description, images, compatibleModels...`. El importador CSV del panel de
administracion (`/admin/productos` → Importar CSV) esta contemplado en el
roadmap pendiente; mientras tanto puedes usar `prisma/seed.ts` como plantilla
para escribir un script de import a medida.

## 🔧 Scripts disponibles

| Comando              | Descripcion                                    |
|-----------------------|--------------------------------------------------|
| `npm run dev`         | Servidor de desarrollo                          |
| `npm run build`       | Build de produccion                             |
| `npm run start`       | Sirve el build de produccion                    |
| `npm run lint`        | Linter (ESLint)                                 |
| `npm run format`      | Formatea el codigo (Prettier)                   |
| `npm run db:push`     | Sincroniza el esquema Prisma con la base de datos |
| `npm run db:migrate`  | Crea una migracion versionada                   |
| `npm run db:studio`   | Abre Prisma Studio (explorador visual de datos) |
| `npm run db:seed`     | Carga datos de ejemplo                          |

## ☁️ Despliegue

El proyecto esta pensado para desplegarse en [Vercel](https://vercel.com):

1. Importa el repositorio en Vercel
2. Configura las mismas variables de entorno de `.env`
3. Configura el webhook de Stripe apuntando a
   `https://tu-dominio.com/api/webhooks/stripe`

## 🛣️ Roadmap / pendiente

Este proyecto se entrega en un punto funcional pero sigue en construccion.
Lo siguiente esta planificado para la proxima iteracion:

- [ ] Webhook de Stripe (`/api/webhooks/stripe`) para confirmar pagos, crear
      el pedido en base de datos y descontar stock automaticamente
- [ ] Panel de administracion completo: crear/editar/eliminar productos,
      cambiar precios/stock/imagenes desde la UI
- [ ] Importador y exportador CSV de productos
- [ ] Gestion de direcciones de envio desde "Mi cuenta"
- [ ] Tests automatizados (unitarios e integracion)

## 📄 Licencia

Proyecto privado. Todos los derechos reservados.
