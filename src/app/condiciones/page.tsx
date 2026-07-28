import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Condiciones de venta",
};

export default function CondicionesPage() {
  return (
    <div className="container-premium py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold">Condiciones de venta</h1>
        <p className="mt-2 text-sm text-brand-gray-400">
          Texto de partida: revisalo con un profesional legal antes de publicar
          la tienda.
        </p>

        <div className="prose prose-sm mt-8 max-w-none text-brand-gray-600">
          <h2 className="mt-8 text-lg font-semibold text-brand-black">1. Precios y pago</h2>
          <p>
            Todos los precios se muestran en euros (EUR) e incluyen el IVA
            aplicable. El pago se procesa de forma segura a traves de Stripe.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-brand-black">2. Envios</h2>
          <p>
            Los pedidos se preparan en un plazo de 24-48h laborables. El coste
            y plazo de envio se calculan en el proceso de pago segun la
            direccion de destino.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-brand-black">
            3. Devoluciones y desistimiento
          </h2>
          <p>
            Dispones de 14 dias naturales desde la recepcion del pedido para
            ejercer tu derecho de desistimiento, devolviendo el producto en su
            estado y embalaje original.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-brand-black">4. Garantia</h2>
          <p>
            Todos los productos cuentan con la garantia legal de conformidad
            de 2 años establecida por la normativa vigente.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-brand-black">
            5. Compatibilidad de piezas
          </h2>
          <p>
            La informacion de compatibilidad de cada producto se ofrece a
            titulo orientativo y verificado por nuestro equipo tecnico; en
            caso de duda, contacta antes de realizar la compra.
          </p>
        </div>
      </div>
    </div>
  );
}
