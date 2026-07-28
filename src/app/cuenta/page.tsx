import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { AuthForm } from "@/components/account/AuthForm";
import { SignOutButton } from "@/components/account/SignOutButton";
import { Package, MapPin, LogOut } from "lucide-react";

export const metadata = { title: "Mi cuenta" };

export default async function CuentaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="container-premium py-16">
        <h1 className="mb-8 text-center text-3xl font-semibold">Mi cuenta</h1>
        <AuthForm />
      </div>
    );
  }

  const profile = await prisma.user.findUnique({ where: { authId: user.id } });

  return (
    <div className="container-premium py-16">
      <h1 className="mb-8 text-3xl font-semibold">Hola{profile?.name ? `, ${profile.name}` : ""}</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/cuenta/pedidos"
          className="flex items-center gap-4 rounded-xl2 border border-brand-gray-200 p-6 transition-colors hover:border-brand-black"
        >
          <Package className="h-6 w-6" />
          <div>
            <p className="font-medium">Mis pedidos</p>
            <p className="text-sm text-brand-gray-500">Consulta el historial y el estado de tus pedidos</p>
          </div>
        </Link>

        <div className="flex items-center gap-4 rounded-xl2 border border-brand-gray-200 p-6">
          <MapPin className="h-6 w-6" />
          <div>
            <p className="font-medium">Direcciones</p>
            <p className="text-sm text-brand-gray-500">{user.email}</p>
          </div>
        </div>

        <SignOutButton />
      </div>

      {profile?.role === "ADMIN" && (
        <Link href="/admin" className="btn-secondary mt-8 inline-flex">
          Ir al panel de administracion
        </Link>
      )}
    </div>
  );
}
