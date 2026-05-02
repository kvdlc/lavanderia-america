"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import type { VehicleType } from "@/types";

const TYPE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: "recojo", label: "Recojo" },
  { value: "entrega", label: "Entrega" },
  { value: "ambos", label: "Ambos" },
];

export default function EditarVehiculoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    plate: "",
    name: "",
    type: "ambos" as VehicleType,
    driver_name: "",
    driver_phone: "",
    active: true,
  });

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error: err }) => {
        if (err) {
          setError(err.message);
        } else if (data) {
          setForm({
            plate: data.plate || "",
            name: data.name || "",
            type: data.type,
            driver_name: data.driver_name || "",
            driver_phone: data.driver_phone || "",
            active: data.active,
          });
        }
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.plate) {
      setError("La placa es obligatoria");
      return;
    }
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: err } = await supabase
      .from("vehicles")
      .update({
        plate: form.plate,
        name: form.name || null,
        type: form.type,
        driver_name: form.driver_name || null,
        driver_phone: form.driver_phone || null,
        active: form.active,
      })
      .eq("id", id);

    if (err) {
      setError(err.message);
      setSaving(false);
    } else {
      router.push("/admin/movilidad");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error && !form.plate) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-600">Error: {error}</p>
        <Link href="/admin/movilidad"><Button variant="outline">Volver a Movilidad</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <Link href="/admin/movilidad" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue">
        <ArrowLeft className="h-4 w-4" />
        Volver a Movilidad
      </Link>
      <h2 className="text-2xl font-bold text-brand-blue">Editar Vehiculo</h2>
      <Card>
        <CardHeader>
          <CardTitle>Informacion del Vehiculo</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="plate">Placa</Label>
              <Input id="plate" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="name">Nombre del Vehiculo</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as VehicleType })}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="driver">Nombre del Conductor</Label>
                <Input id="driver" value={form.driver_name} onChange={(e) => setForm({ ...form, driver_name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="driver_phone">Telefono del Conductor</Label>
                <Input id="driver_phone" value={form.driver_phone} onChange={(e) => setForm({ ...form, driver_phone: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="active" checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label htmlFor="active">Activo</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar Cambios
              </Button>
              <Link href="/admin/movilidad">
                <Button variant="outline" type="button">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
