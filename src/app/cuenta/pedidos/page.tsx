import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Mis pedidos" };

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente de pago",
  PAID: "Pagado",
  PROCESSING: "En preparacion",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

export default async function PedidosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/cuenta");

  const profile = await prisma.user.findUnique({ where: { authId: user.id } });
  const orders = profile
    ? await prisma.order.findMany({
        where: { userId: profile.id },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="container-premium py-12">
      <h1 className="mb-8 text-3xl font-semibold">Mis pedidos</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-brand-gray-300 py-20 text-center">
          <p className="text-lg font-medium">Todavia no has hecho ningun pedido</p>
          <Link href="/catalogo" className="btn-primary mt-6 inline-flex">
            Empezar a comprar
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl2 border border-brand-gray-200 p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">Pedido {order.orderNumber}</p>
                  <p className="text-sm text-brand-gray-500">
                    {order.createdAt.toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className="rounded-full bg-brand-gray-100 px-3 py-1 text-xs font-medium">
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </div>
              <div className="mt-4 flex justify-between border-t border-brand-gray-100 pt-4 text-sm">
                <span className="text-brand-gray-500">{order.items.length} articulos</span>
                <span className="font-semibold">{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
