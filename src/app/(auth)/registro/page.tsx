"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("full_name") as string;
    const phone = formData.get("phone") as string;
    const companyName = formData.get("company_name") as string;
    const ruc = formData.get("ruc") as string;

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          email,
          full_name: fullName,
          role: "client",
          phone: phone || null,
          company_name: companyName || null,
          ruc: ruc || null,
        });
      }

      router.push("/cliente");
    } catch {
      setError("Servicio no disponible. Intente nuevamente.");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img
            src="/images/logo%20lavanderia%20para%20fondo%20claro.png"
            alt="Lavandería América"
            className="mx-auto mb-4 h-12 w-auto"
          />
          <CardTitle className="text-2xl text-brand-blue">Crear Cuenta</CardTitle>
          <CardDescription>
            Regístrese para solicitar cotizaciones y hacer seguimiento de sus pedidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre completo</Label>
              <Input id="full_name" name="full_name" placeholder="Juan Pérez" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" name="email" type="email" placeholder="correo@empresa.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+51 999 999 999" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">Empresa</Label>
              <Input id="company_name" name="company_name" placeholder="Nombre de su empresa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ruc">RUC</Label>
              <Input id="ruc" name="ruc" placeholder="20XXXXXXXXX" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" placeholder="Mínimo 6 caracteres" required minLength={6} />
            </div>
            {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full bg-brand-blue hover:brightness-110" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Cuenta
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tiene una cuenta?{" "}
            <Link href="/login" className="font-medium text-brand-blue hover:underline">
              Inicie sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
