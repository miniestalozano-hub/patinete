# Transición de GitHub Pages a Vercel

Este plan detalla los pasos para revertir la configuración de sitio estático y preparar el proyecto para ser desplegado en Vercel, lo cual permitirá que Stripe, el Middleware y las APIs funcionen correctamente.

## Razones del Cambio

> [!NOTE]
> **Funcionalidad Completa**: Vercel permite ejecutar código de servidor, lo que habilita:
> - Pagos seguros con **Stripe**.
> - Protección de rutas con el **Middleware**.
> - Actualizaciones de datos en tiempo real (sin necesidad de reconstruir toda la web).

## Pasos a Seguir

### 1. Revertir Cambios de Sitio Estático

#### [MODIFY] [next.config.mjs](file:///Users/pedrocanovas/Documents/personal/manuel2/next.config.mjs)
- Eliminar `output: 'export'`, `basePath` y `trailingSlash`.
- Restaurar la optimización de imágenes (quitar `unoptimized: true`).
- Mantener las cabeceras de seguridad originales.

#### [MODIFY] [src/middleware.ts](file:///Users/pedrocanovas/Documents/personal/manuel2/src/middleware.ts)
- Renombrar `src/middleware.ts.disabled` de vuelta a `src/middleware.ts`.

#### [DELETE] [.github/workflows/deploy.yml](file:///Users/pedrocanovas/Documents/personal/manuel2/.github/workflows/deploy.yml)
- Eliminar el flujo de trabajo de GitHub Pages ya que Vercel gestiona su propio despliegue.

#### [MODIFY] [Páginas de Producto y Catálogo]
- Eliminar `generateStaticParams` y las funciones auxiliares de `src/lib/products.ts` para volver al estado original dinámico (o dejarlas si se prefiere caché, pero lo ideal es simplificar para evitar errores de conexión durante el build en Vercel si no están las variables listas).

### 2. Preparación para Vercel

- Asegurar que el archivo `package.json` tiene los scripts correctos (`build`, `start`, `dev`).
- El usuario deberá conectar su repositorio de GitHub a Vercel.

## Guía de Configuración en Vercel (Para el Usuario)

1. Crear cuenta en [Vercel](https://vercel.com).
2. Pulsar **"Add New"** > **"Project"**.
3. Importar el repositorio `patinete`.
4. En la sección **"Environment Variables"**, añadir las mismas que comentamos antes:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (la URL que te asigne Vercel).
5. Pulsar **"Deploy"**.

## Plan de Verificación

- Comprobar que el proyecto compila localmente con `npm run build` sin el modo export.
- Verificar que el middleware vuelve a estar activo.
