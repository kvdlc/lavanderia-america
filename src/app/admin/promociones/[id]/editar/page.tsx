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
import { ArrowLeft, Loader2, Save } from "lucide-react";

export default function EditarPromocionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    discount_percent: "0",
    valid_from: "",
    valid_until: "",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("promotions")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error: err }) => {
        if (err) {
          setError(err.message);
        } else if (data) {
          setForm({
            title: data.title,
            description: data.description || "",
            discount_percent: String(data.discount_percent),
            valid_from: data.valid_from ? data.valid_from.split("T")[0] : "",
            valid_until: data.valid_until ? data.valid_until.split("T")[0] : "",
          });
        }
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.valid_until) {
      setError("Titulo y fecha de vencimiento son obligatorios");
      return;
    }
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: err } = await supabase
      .from("promotions")
      .update({
        title: form.title,
        description: form.description || null,
        discount_percent: Number(form.discount_percent) || 0,
        valid_from: form.valid_from,
        valid_until: form.valid_until,
      })
      .eq("id", id);

    if (err) {
      setError(err.message);
      setSaving(false);
    } else {
      router.push("/admin/promociones");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error && !form.title) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-600">Error: {error}</p>
        <Link href="/admin/promociones"><Button variant="outline">Volver a Promociones</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <Link href="/admin/promociones" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue">
        <ArrowLeft className="h-4 w-4" />
        Volver a Promociones
      </Link>
      <h2 className="text-2xl font-bold text-brand-blue">Editar Promocion</h2>
      <Card>
        <CardHeader>
          <CardTitle>Informacion de la Promocion</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Titulo</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="desc">Descripcion</Label>
              <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div>
              <Label htmlFor="discount">Descuento (%)</Label>
              <Input id="discount" type="number" min="0" max="100" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from">Valido Desde</Label>
                <Input id="from" type="date" value={form.valid_from} onChange={(e) => setForm({ ...form, valid_from: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="until">Valido Hasta</Label>
                <Input id="until" type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} required />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar Cambios
              </Button>
              <Link href="/admin/promociones">
                <Button variant="outline" type="button">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
