# Proyecto Preparado para Vercel (Con Stripe y Middleware)

He revertido todas las limitaciones de "sitio estático" que requería GitHub Pages. Ahora el proyecto vuelve a ser una aplicación **Next.js dinámica completa**, lo que significa que **Stripe** y el **Middleware** funcionarán perfectamente cuando lo subas a Vercel.

## Cambios Realizados para la Restauración

### 1. Configuración de Next.js Restaurada
- Se ha eliminado el modo `output: 'export'`.
- Se han quitado los prefijos de ruta (`basePath`) para que la web funcione en el dominio principal que te dé Vercel.
- Se ha reactivado la **optimización de imágenes** nativa.

### 2. Middleware Reactivado
- El archivo `src/middleware.ts` vuelve a estar activo. Esto restaurará la seguridad en las rutas de `/admin` y la gestión de sesiones de usuario.

### 3. Código Limpio y Dinámico
- He eliminado las funciones de pre-renderizado estático que añadimos antes. Ahora la web consultará la base de datos de Supabase en tiempo real, permitiendo que Stripe pueda verificar precios y stock de forma segura.
- Se ha eliminado el flujo de trabajo de GitHub Pages (`.github/workflows/deploy.yml`) para evitar confusiones.

---

## Guía para el Despliegue en Vercel

Sigue estos pasos para tener tu tienda funcionando en menos de 5 minutos:

1. **Sube el código a GitHub**: Haz un `git push` con los cambios que he aplicado.
2. **Entra en [Vercel](https://vercel.com)** e inicia sesión con tu cuenta de GitHub.
3. Pulsa en **"Add New" > "Project"**.
4. Busca tu repositorio `patinete` y dale a **"Import"**.
5. **MUY IMPORTANTE**: En el apartado **"Environment Variables"**, añade las mismas variables que configuramos antes (usa los valores de tu `.env` o los que sacaste de Supabase y Stripe):
    - `DATABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `STRIPE_SECRET_KEY`
    - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
    - `NEXT_PUBLIC_SITE_URL` (puedes poner la URL que te asigne Vercel después del primer despliegue).
6. Dale a **"Deploy"**.

> [!TIP]
> Una vez termine el despliegue, Vercel te dará una URL (ej: `patinete.vercel.app`). ¡Tu tienda estará totalmente funcional, incluyendo los pagos con Stripe!
