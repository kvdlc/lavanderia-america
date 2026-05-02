"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export default function ConfiguracionPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    igv_rate: "18",
    delivery_days: "25",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("config")
      .select("*")
      .then(({ data }) => {
        if (data && data.length > 0) {
          const cfg = data[0] as any;
          if (cfg.igv_rate) setForm((f) => ({ ...f, igv_rate: String(cfg.igv_rate * 100) }));
          if (cfg.delivery_days) setForm((f) => ({ ...f, delivery_days: String(cfg.delivery_days) }));
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const igvRate = Number(form.igv_rate) / 100;
    const deliveryDays = Number(form.delivery_days);

    const supabase = createClient();
    const { error: err } = await supabase
      .from("config")
      .upsert({
        key: "system",
        igv_rate: isNaN(igvRate) ? 0.18 : igvRate,
        delivery_days: isNaN(deliveryDays) ? 25 : deliveryDays,
        updated_at: new Date().toISOString(),
      }, { onConflict: "key" });

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

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
      </div>
      <h2 className="text-2xl font-bold text-brand-blue">Configuracion</h2>

      <Card>
        <CardHeader>
          <CardTitle>Parametros del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm">Configuracion guardada correctamente</div>
          )}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="igv">Tasa IGV (%)</Label>
              <Input
                id="igv"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.igv_rate}
                onChange={(e) => setForm({ ...form, igv_rate: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">Porcentaje de IGV aplicado a los pedidos</p>
            </div>
            <div>
              <Label htmlFor="delivery">Dias Estimados de Entrega</Label>
              <Input
                id="delivery"
                type="number"
                min="1"
                max="90"
                value={form.delivery_days}
                onChange={(e) => setForm({ ...form, delivery_days: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">Dias estimados por defecto para la entrega de pedidos</p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar Configuracion
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
