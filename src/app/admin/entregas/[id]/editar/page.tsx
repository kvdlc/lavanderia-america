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
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Loader2, Save, CheckCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/types";
import type { Vehicle, Order, Delivery, DeliveryItem, DeliveryType, DeliveryStatus } from "@/types";

const TYPE_OPTIONS: { value: DeliveryType; label: string }[] = [
  { value: "recojo", label: "Recojo" },
  { value: "entrega", label: "Entrega" },
  { value: "ambos", label: "Ambos" },
];

const STATUS_OPTIONS: { value: DeliveryStatus; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en_ruta", label: "En Ruta" },
  { value: "completado", label: "Completado" },
  { value: "fallido", label: "Fallido" },
];

const STATUS_CLASSES: Record<DeliveryStatus, string> = {
  pendiente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  en_ruta: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  completado: "bg-green-100 text-green-800 hover:bg-green-100",
  fallido: "bg-red-100 text-red-800 hover:bg-red-100",
};

export default function EditarEntregaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [items, setItems] = useState<(DeliveryItem & { order?: Order })[]>([]);
  const [form, setForm] = useState({
    vehicle_id: "",
    type: "entrega" as DeliveryType,
    scheduled_date: "",
    status: "pendiente" as DeliveryStatus,
    notes: "",
  });

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("vehicles").select("*").eq("active", true).order("name"),
      supabase.from("deliveries").select("*, items:delivery_items(*, order:orders(*))").eq("id", id).single(),
    ]).then(([vehRes, delRes]) => {
      if (vehRes.data) setVehicles(vehRes.data);

      if (delRes.error) {
        setError(delRes.error.message);
      } else if (delRes.data) {
        setForm({
          vehicle_id: delRes.data.vehicle_id || "",
          type: delRes.data.type,
          scheduled_date: delRes.data.scheduled_date ? delRes.data.scheduled_date.split("T")[0] : "",
          status: delRes.data.status,
          notes: delRes.data.notes || "",
        });
        setItems(((delRes.data as any).items || []) as (DeliveryItem & { order?: Order })[]);
      }
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const updates: Record<string, any> = {
      vehicle_id: form.vehicle_id,
      type: form.type,
      scheduled_date: form.scheduled_date,
      status: form.status,
      notes: form.notes || null,
    };

    if (form.status === "completado") {
      updates.actual_date = new Date().toISOString();
    }

    const { error: err } = await supabase
      .from("deliveries")
      .update(updates)
      .eq("id", id);

    if (err) {
      setError(err.message);
      setSaving(false);
    } else {
      router.push("/admin/entregas");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error && !form.vehicle_id) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-600">Error: {error}</p>
        <Link href="/admin/entregas"><Button variant="outline">Volver a Entregas</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/admin/entregas" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue">
        <ArrowLeft className="h-4 w-4" />
        Volver a Entregas
      </Link>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-blue">Editar Entrega</h2>
        <Badge className={`text-sm px-3 py-1 ${STATUS_CLASSES[form.status]}`}>
          {STATUS_OPTIONS.find((s) => s.value === form.status)?.label}
        </Badge>
      </div>

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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as DeliveryType })}>
                  <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as DeliveryStatus })}>
                  <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar Cambios
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
          <CardTitle>Pedidos ({items.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                    Sin pedidos asignados
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">#{item.order_id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <Badge className={item.order ? "" : "bg-gray-100 text-gray-600"}>
                        {item.order ? ORDER_STATUS_LABELS[item.order.status] || item.order.status : "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.order ? formatCurrency(item.order.total) : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
