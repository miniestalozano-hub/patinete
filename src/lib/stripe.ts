import Stripe from "stripe";

/**
 * Instancia de Stripe para uso exclusivo en el servidor (Route Handlers,
 * Server Actions). No importar nunca este fichero desde un Client Component.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
  appInfo: {
    name: "patin-shop",
    version: "1.0.0",
  },
});
