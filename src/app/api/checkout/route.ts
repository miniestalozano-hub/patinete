import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/checkout
 * Recibe los items del carrito ({ productId, quantity }[]) y crea una
 * Stripe Checkout Session. Los precios se recalculan SIEMPRE en el
 * servidor a partir de la base de datos, nunca se confia en el precio
 * que pueda mandar el cliente.
 */
export async function POST(request: NextRequest) {
  try {
    const { items } = (await request.json()) as {
      items: { productId: string; quantity: number }[];
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito esta vacio" }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) }, status: "PUBLISHED" },
      include: { images: { take: 1, orderBy: { order: "asc" } } },
    });

    const lineItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Producto ${item.productId} no encontrado`);
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${product.name}`);
      }

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            images: product.images[0] ? [product.images[0].url] : undefined,
            metadata: { productId: product.id, sku: product.sku },
          },
          unit_amount: Math.round(Number(product.price) * 100),
        },
        quantity: item.quantity,
      };
    });

    // El usuario puede no tener sesion iniciada (checkout como invitado).
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["ES", "PT", "FR", "IT", "DE"] },
      success_url: `${siteUrl}/carrito/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/carrito`,
      customer_email: user?.email,
      metadata: {
        userId: user?.id ?? "guest",
        items: JSON.stringify(items),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Error creando la sesion de checkout:", err);
    const message = err instanceof Error ? err.message : "Error inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
