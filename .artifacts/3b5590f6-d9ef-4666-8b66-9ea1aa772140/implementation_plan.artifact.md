# Despliegue en GitHub Pages

Este plan detalla los cambios necesarios para que el proyecto Next.js pueda ser visualizado en GitHub Pages. Dado que GitHub Pages es una plataforma de hosting **estático**, debemos convertir la aplicación para que funcione sin un servidor Node.js en tiempo de ejecución.

## Consideraciones Importantes y Limitaciones

> [!WARNING]
> **GitHub Pages es Estático**: Esto significa que las siguientes funcionalidades de Next.js **no funcionarán**:
> - **API Routes**: Todo lo que esté en `src/app/api` no estará disponible.
> - **Middleware**: `src/middleware.ts` no se ejecutará (la protección de rutas debe ser puramente cliente).
> - **Prisma (en tiempo de ejecución)**: No se puede conectar a la base de datos desde el navegador directamente usando Prisma.
> - **Server Actions**: No funcionarán.

> [!IMPORTANT]
> **Solución para los Datos**:
> - Para que la web sea funcional, los productos deben generarse de forma estática durante el build o la aplicación debe ser refactorizada para consultar Supabase directamente desde el cliente (sin pasar por Prisma/API).
> - En este plan, nos enfocaremos en la configuración necesaria para el **export estático** y la automatización con **GitHub Actions**.

## Cambios Propuestos

### Configuración de Next.js

#### [MODIFY] [next.config.mjs](file:///Users/pedrocanovas/Documents/personal/manuel2/next.config.mjs)
- Configurar `output: 'export'` para generar archivos HTML/CSS/JS estáticos.
- Establecer `basePath` y `assetPrefix` para que los recursos carguen correctamente desde el subdirectorio del repositorio (ej. `/manuel2`).
- Desactivar la optimización de imágenes nativa de Next.js (`unoptimized: true`), ya que requiere un servidor.
- Activar `trailingSlash: true` para mejorar la compatibilidad de rutas en GitHub Pages.

### Automatización (CI/CD)

#### [NEW] [deploy.yml](file:///Users/pedrocanovas/Documents/personal/manuel2/.github/workflows/deploy.yml)
- Crear un workflow de GitHub Actions que:
    1. Instale dependencias.
    2. Ejecute `prisma generate` (necesario para el build aunque no se use en runtime).
    3. Construya la aplicación (`next build`).
    4. Despliegue la carpeta `out/` a la rama `gh-pages` o use el método moderno de GitHub Pages Actions.

### Ajustes en el Código

#### [MODIFY] [src/middleware.ts](file:///Users/pedrocanovas/Documents/personal/manuel2/src/middleware.ts)
- El middleware debe ser deshabilitado o ignorado para el export estático, ya que Next.js lanzará un error si intenta exportar una app con middleware.

#### [MODIFY] [src/lib/products.ts](file:///Users/pedrocanovas/Documents/personal/manuel2/src/lib/products.ts) (y relacionados)
- Asegurar que las páginas de productos usen `generateStaticParams` para que se generen sus HTMLs en el build.

## Plan de Verificación

### Verificación Manual
- Ejecutar `npm run build` localmente y verificar que se genera la carpeta `out/`.
- Usar un servidor local (como `npx serve out`) para comprobar que los enlaces y recursos (imágenes) funcionan con el `basePath`.
- Comprobar que el catálogo muestra productos (esto dependerá de si los datos están disponibles durante el build).

## Preguntas Abiertas
- **¿Cuál es el nombre exacto del repositorio en GitHub?** (Necesario para configurar el `basePath`). Asumiremos `manuel2` por ahora.
- **¿Cómo quieres manejar los datos dinámicos?** Para que el carrito y el catálogo funcionen 100% en GitHub Pages, deberíamos migrar las llamadas a la API a llamadas directas al cliente de Supabase. ¿Procedo con esta migración o solo configuro el despliegue básico?
