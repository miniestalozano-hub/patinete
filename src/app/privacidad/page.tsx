import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de privacidad",
  robots: { index: true, follow: false },
};

export default function PrivacidadPage() {
  return (
    <div className="container-premium py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold">Politica de privacidad</h1>
        <p className="mt-2 text-sm text-brand-gray-400">
          Ultima actualizacion: sustituye este texto por el redactado legal
          definitivo antes de publicar la tienda.
        </p>

        <div className="prose prose-sm mt-8 max-w-none text-brand-gray-600">
          <h2 className="mt-8 text-lg font-semibold text-brand-black">
            1. Responsable del tratamiento
          </h2>
          <p>
            [Nombre de la empresa / autonomo], con NIF [XXXXXXXX] y domicilio en
            [direccion], es el responsable del tratamiento de los datos personales
            del usuario.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-brand-black">
            2. Datos que recopilamos
          </h2>
          <p>
            Recopilamos los datos necesarios para gestionar tu cuenta y tus
            pedidos: nombre, email, telefono, direccion de envio y, a traves de
            Stripe, los datos de pago (Stripe no comparte con nosotros los
            numeros de tarjeta completos).
          </p>

          <h2 className="mt-8 text-lg font-semibold text-brand-black">
            3. Finalidad del tratamiento
          </h2>
          <p>
            Gestionar el registro de usuarios, procesar y enviar pedidos,
            atender consultas de soporte y, si el usuario lo consiente,
            enviar comunicaciones comerciales.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-brand-black">
            4. Derechos del usuario
          </h2>
          <p>
            Puedes ejercer tus derechos de acceso, rectificacion, supresion,
            oposicion, limitacion y portabilidad escribiendo a
            [email de contacto].
          </p>

          <h2 className="mt-8 text-lg font-semibold text-brand-black">
            5. Proveedores externos
          </h2>
          <p>
            Utilizamos Supabase (base de datos y autenticacion) y Stripe
            (procesamiento de pagos) como encargados del tratamiento,
            ambos con garantias adecuadas de proteccion de datos.
          </p>
        </div>
      </div>
    </div>
  );
}
