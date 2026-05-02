"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import type { BillingCycle } from "@/types";

const CYCLE_OPTIONS: { value: BillingCycle; label: string }[] = [
  { value: "semanal", label: "Semanal" },
  { value: "quincenal", label: "Quincenal" },
  { value: "mensual", label: "Mensual" },
  { value: "personalizado", label: "Personalizado" },
];

export default function EditarSucursalPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    contact_person: "",
    commission_percent: "0",
    billing_cycle: "quincenal" as BillingCycle,
    active: true,
    notes: "",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("branches")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error: err }) => {
        if (err) {
          setError(err.message);
        } else if (data) {
          setForm({
            name: data.name || "",
            address: data.address || "",
            phone: data.phone || "",
            contact_person: data.contact_person || "",
            commission_percent: String(data.commission_percent),
            billing_cycle: data.billing_cycle,
            active: data.active,
            notes: data.notes || "",
          });
        }
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      setError("El nombre es obligatorio");
      return;
    }
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: err } = await supabase
      .from("branches")
      .update({
        name: form.name,
        address: form.address || null,
        phone: form.phone || null,
        contact_person: form.contact_person || null,
        commission_percent: Number(form.commission_percent) || 0,
        billing_cycle: form.billing_cycle,
        active: form.active,
        notes: form.notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (err) {
      setError(err.message);
      setSaving(false);
    } else {
      router.push("/admin/sucursales");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error && !form.name) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-600">Error: {error}</p>
        <Link href="/admin/sucursales"><Button variant="outline">Volver a Sucursales</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <Link href="/admin/sucursales" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue">
        <ArrowLeft className="h-4 w-4" />
        Volver a Sucursales
      </Link>
      <h2 className="text-2xl font-bold text-brand-blue">Editar Sucursal</h2>
      <Card>
        <CardHeader>
          <CardTitle>Informacion de la Sucursal</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="address">Direccion</Label>
              <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefono</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="contact">Persona de Contacto</Label>
                <Input id="contact" value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="commission">Comision (%)</Label>
                <Input id="commission" type="number" min="0" max="100" value={form.commission_percent} onChange={(e) => setForm({ ...form, commission_percent: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="cycle">Ciclo de Facturacion</Label>
                <Select value={form.billing_cycle} onValueChange={(v) => setForm({ ...form, billing_cycle: v as BillingCycle })}>
                  <SelectTrigger id="cycle">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CYCLE_OPTIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="active" checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label htmlFor="active">Activo</Label>
            </div>
            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar Cambios
              </Button>
              <Link href="/admin/sucursales">
                <Button variant="outline" type="button">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
