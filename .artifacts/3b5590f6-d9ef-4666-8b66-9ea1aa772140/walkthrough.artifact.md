# Despliegue en GitHub Pages Completado

Se han aplicado todos los cambios necesarios para que el proyecto pueda ser exportado como un sitio estático y desplegado en la URL: `https://miniestalozano-hub.github.io/patinete/`.

## Cambios Realizados

### 1. Configuración de Next.js
Se ha modificado [next.config.mjs](file:///Users/pedrocanovas/Documents/personal/manuel2/next.config.mjs) para:
- Habilitar `output: 'export'`.
- Configurar el `basePath` a `/patinete`.
- Desactivar la optimización de imágenes en el servidor (`unoptimized: true`), necesaria para sitios estáticos.
- Forzar el uso de `trailingSlash: true` para evitar errores de 404 en GitHub Pages.

### 2. Automatización con GitHub Actions
Se ha creado el archivo [.github/workflows/deploy.yml](file:///Users/pedrocanovas/Documents/personal/manuel2/.github/workflows/deploy.yml). Este flujo hará lo siguiente en cada push a la rama `main`:
- Instalar dependencias.
- Generar el cliente de Prisma.
- Ejecutar `npm run build` (que generará la carpeta `out/`).
- Publicar el contenido en GitHub Pages.

### 3. Ajustes de Código
- **Middleware**: Se ha renombrado [src/middleware.ts](file:///Users/pedrocanovas/Documents/personal/manuel2/src/middleware.ts) a `middleware.ts.disabled` porque Next.js no permite middleware en exportaciones estáticas.
- **Pre-renderizado de Páginas**: Se ha añadido `generateStaticParams` en:
    - [Página de producto](file:///Users/pedrocanovas/Documents/personal/manuel2/src/app/producto/%5Bslug%5D/page.tsx)
    - [Página de categoría](file:///Users/pedrocanovas/Documents/personal/manuel2/src/app/catalogo/%5Bcategoria%5D/page.tsx)
    - [Página de subcategoría](file:///Users/pedrocanovas/Documents/personal/manuel2/src/app/catalogo/%5Bcategoria%5D/%5Bsubcategoria%5D/page.tsx)
    - Esto asegura que todas las fichas de productos y categorías se generen como HTML estático durante el build.

## Pasos Siguientes Obligatorios

Para que el despliegue funcione, **debes configurar los Secrets en tu repositorio de GitHub**:

1. Ve a tu repositorio en GitHub > **Settings** > **Secrets and variables** > **Actions**.
2. Añade los siguientes **Repository secrets** (usa los valores de tu archivo `.env` local):
    - `DATABASE_URL`: Tu cadena de conexión a Supabase Postgres.
    - `NEXT_PUBLIC_SUPABASE_URL`: Tu URL de proyecto de Supabase.
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase.
    - `STRIPE_SECRET_KEY`: Tu clave secreta de Stripe.
    - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Tu clave pública de Stripe.

> [!IMPORTANT]
> **Sobre los datos**: Dado que el sitio es estático, los productos se "congelan" en el momento del build. Si añades un producto en Supabase, la web no se actualizará hasta que el Action de GitHub se ejecute de nuevo (puedes lanzarlo manualmente o hacer un push).
