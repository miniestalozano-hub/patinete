import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Resolvemos las dudas mas habituales sobre compatibilidad, envios y devoluciones.",
};

const FAQS = [
  {
    q: "¿Como se si una pieza es compatible con mi patinete?",
    a: "Cada ficha de producto incluye un apartado 'Compatible con' donde listamos los modelos exactos verificados. Si tu modelo no aparece, contacta con nosotros antes de comprar y te lo confirmamos.",
  },
  {
    q: "¿Cuanto tarda en llegar mi pedido?",
    a: "Los pedidos se preparan en 24-48h laborables. El tiempo de entrega depende de la zona, pero la mayoria de envios nacionales llegan en 2-4 dias laborables.",
  },
  {
    q: "¿Puedo devolver una pieza si no encaja?",
    a: "Si, dispones de 14 dias naturales desde la recepcion para devolver cualquier producto sin usar y en su embalaje original. Consulta el detalle en Condiciones.",
  },
  {
    q: "¿Ofreceis garantia en los recambios?",
    a: "Todas las piezas incluyen garantia legal minima de 2 años frente a defectos de fabricacion.",
  },
  {
    q: "¿Puedo pagar de forma segura con tarjeta?",
    a: "Si, todos los pagos se procesan a traves de Stripe, cumpliendo los estandares de seguridad PCI-DSS. No almacenamos los datos de tu tarjeta en ningun momento.",
  },
];

export default function FaqPage() {
  return (
    <div className="container-premium py-16">
      <h1 className="mb-10 text-3xl font-semibold">Preguntas frecuentes</h1>
      <div className="mx-auto max-w-3xl divide-y divide-brand-gray-200">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
              {item.q}
              <span className="ml-4 text-brand-gray-400 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-brand-gray-600">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
