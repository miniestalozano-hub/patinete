"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactoPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // NOTA: aqui se puede conectar un endpoint /api/contacto que envie el
    // email con Resend (ver RESEND_API_KEY en .env.example). De momento
    // el formulario simula el envio para no bloquear el flujo de UI.
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="container-premium py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h1 className="text-3xl font-semibold">Contacto</h1>
          <p className="mt-3 max-w-md text-brand-gray-500">
            ¿Dudas sobre compatibilidad, un pedido o una pieza que no encuentras?
            Escribenos y te respondemos en menos de 24h laborables.
          </p>

          <div className="mt-8 flex flex-col gap-4 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-brand-blue" />
              <span>hola@patinshop.example</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-brand-blue" />
              <span>+34 900 000 000</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-brand-blue" />
              <span>España</span>
            </div>
          </div>
        </div>

        <div>
          {sent ? (
            <div className="rounded-xl2 border border-brand-gray-200 p-8 text-center">
              <p className="text-lg font-medium">Mensaje enviado</p>
              <p className="mt-2 text-sm text-brand-gray-500">
                Gracias por escribirnos, te responderemos lo antes posible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Nombre</label>
                <input
                  required
                  className="w-full rounded-lg border border-brand-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  className="w-full rounded-lg border border-brand-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Mensaje</label>
                <textarea
                  required
                  rows={5}
                  className="w-full rounded-lg border border-brand-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
                />
              </div>
              <Button type="submit" isLoading={loading} size="lg" className="mt-2">
                Enviar mensaje
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
