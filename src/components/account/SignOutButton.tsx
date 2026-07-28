"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-4 rounded-xl2 border border-brand-gray-200 p-6 text-left transition-colors hover:border-red-400"
    >
      <LogOut className="h-6 w-6 text-red-500" />
      <div>
        <p className="font-medium text-red-500">Cerrar sesion</p>
        <p className="text-sm text-brand-gray-500">Salir de tu cuenta</p>
      </div>
    </button>
  );
}
