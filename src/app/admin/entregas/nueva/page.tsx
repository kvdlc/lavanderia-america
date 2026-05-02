"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/types";
import type { Vehicle, Order, DeliveryType, VehicleType } from "@/types";

const TYPE_OPTIONS: { value: DeliveryType; label: string }[] = [
  { value: "recojo", label: "Recojo" },
  { value: "entrega", label: "Entrega" },
  { value: "ambos", label: "Ambos" },
];

export default function NuevaEntregaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({
    vehicle_id: "",
    type: "entrega" as DeliveryType,
    scheduled_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("vehicles").select("*").eq("active", true).order("name"),
      supabase.from("orders").select("*").in("status", ["confirmado", "recolectado", "en_proceso", "control_calidad", "listo"]).order("created_at", { ascending: false }),
    ]).then(([vehRes, ordersRes]) => {
      if (vehRes.data) setVehicles(vehRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
      setPageLoading(false);
    });
  }, []);

  const toggleOrder = (orderId: string) => {
    const next = new Set(selectedOrders);
    if (next.has(orderId)) next.delete(orderId);
    else next.add(orderId);
    setSelectedOrders(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicle_id) {
      setError("Seleccione un vehiculo");
      return;
    }
    if (selectedOrders.size === 0) {
      setError("Seleccione al menos un pedido");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { data: delivery, error: delErr } = await supabase
      .from("deliveries")
      .insert({
        vehicle_id: form.vehicle_id,
        type: form.type,
        status: "pendiente",
        scheduled_date: form.scheduled_date,
        notes: form.notes || null,
      })
      .select()
      .single();

    if (delErr) {
      setError(delErr.message);
      setLoading(false);
      return;
    }

    const deliveryItems = Array.from(selectedOrders).map((orderId) => ({
      delivery_id: delivery.id,
      order_id: orderId,
      location_type: form.type,
      address: null,
      completed: false,
    }));

    const { error: itemsErr } = await supabase.from("delivery_items").insert(deliveryItems);

    if (itemsErr) {
      setError(itemsErr.message);
      setLoading(false);
      return;
    }

    router.push("/admin/entregas");
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/admin/entregas" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue">
        <ArrowLeft className="h-4 w-4" />
        Volver a Entregas
      </Link>
      <h2 className="text-2xl font-bold text-brand-blue">Nueva Entrega</h2>

      <Card>
        <CardHeader>
          <CardTitle>Informacion de la Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="vehicle">Vehiculo</Label>
              <Select value={form.vehicle_id} onValueChange={(v) => setForm({ ...form, vehicle_id: v })}>
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder="Seleccionar vehiculo" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.plate} — {v.name || "Sin nombre"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as DeliveryType })}>
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
            <div>
              <Label htmlFor="date">Fecha Programada</Label>
              <Input id="date" type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Crear Entrega
              </Button>
              <Link href="/admin/entregas">
                <Button variant="outline" type="button">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Pedidos ({selectedOrders.size})</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay pedidos pendientes</p>
          ) : (
            <div className="max-h-80 overflow-y-auto space-y-1">
              {orders.map((o) => (
                <label key={o.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedOrders.has(o.id)}
                    onChange={() => toggleOrder(o.id)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                  />
                  <span className="font-mono text-xs">#{o.id.slice(0, 8)}</span>
                  <span className="text-sm flex-1">{ORDER_STATUS_LABELS[o.status]}</span>
                  <span className="text-sm font-medium">{formatCurrency(o.total)}</span>
                </label>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
