"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Check, X } from "lucide-react";
import type { Profile } from "@/types";

export default function ClientePerfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ruc, setRuc] = useState("");

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        setError("No autorizado");
        setLoading(false);
        return;
      }

      supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()
        .then(({ data: profileData, error: err }) => {
          if (err) {
            setError(err.message);
          } else if (profileData) {
            const p = profileData as Profile;
            setProfile(p);
            setFullName(p.full_name || "");
            setPhone(p.phone || "");
            setCompanyName(p.company_name || "");
            setRuc(p.ruc || "");
          }
          setLoading(false);
        });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    const { error: err } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone || null,
        company_name: companyName || null,
        ruc: ruc || null,
      })
      .eq("id", profile.id);

    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-blue">Mi Perfil</h2>
        <p className="text-sm text-gray-500 mt-1">
          Actualice su informacion personal
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Datos de la Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electronico</Label>
              <Input
                id="email"
                type="email"
                value={profile?.email || ""}
                disabled
                className="bg-gray-50"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Su nombre completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+51 999 999 999"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="companyName">Nombre de Empresa</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Razon social"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ruc">RUC</Label>
              <Input
                id="ruc"
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
                placeholder="20XXXXXXXXX"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
                <X className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700">
                <Check className="h-4 w-4 flex-shrink-0" />
                Perfil actualizado correctamente
              </div>
            )}

            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-brand-blue hover:bg-brand-blue/90"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
