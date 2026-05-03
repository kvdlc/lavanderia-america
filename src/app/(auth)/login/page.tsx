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

export default function LoginPage() {
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

    try {
      const supabase = createClient();
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profile?.role === "client") {
          router.push("/cliente");
        } else {
          router.push("/admin");
        }
      }
    } catch {
      setError("Servicio no disponible. Intente nuevamente.");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img
            src="/images/logo%20lavanderia%20para%20fondo%20claro.png"
            alt="Lavandería América"
            className="mx-auto mb-4 h-12 w-auto"
          />
          <CardTitle className="text-2xl text-brand-blue">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingrese sus credenciales para acceder a su cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" name="email" type="email" placeholder="correo@empresa.com" required defaultValue="admin@lavanderia.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" placeholder="Mínimo 6 caracteres" required minLength={6} />
            </div>

            {error && (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>
            )}

            <Button type="submit" className="w-full bg-brand-blue hover:brightness-110" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ingresar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿No tiene cuenta?{" "}
            <Link href="/registro" className="font-medium text-brand-blue hover:underline">
              Regístrese aquí
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
