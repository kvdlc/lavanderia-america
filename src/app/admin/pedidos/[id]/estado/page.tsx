"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { ORDER_STATUS_LABELS } from "@/types";
import type { OrderStatus } from "@/types";

const STATUSES: OrderStatus[] = [
  "cotizacion", "confirmado", "recolectado", "en_proceso",
  "control_calidad", "listo", "entregado", "cancelado",
];

export default function CambiarEstadoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [status, setStatus] = useState<OrderStatus>("confirmado");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note: note || null }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Error al cambiar estado");
      setLoading(false);
    } else {
      router.push(`/admin/pedidos/${id}`);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <Link href={`/admin/pedidos/${id}`} className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue">
        <ArrowLeft className="h-4 w-4" />
        Volver al Pedido
      </Link>
      <h2 className="text-2xl font-bold text-brand-blue">Cambiar Estado — #{id.slice(0, 8)}</h2>

      <Card>
        <CardHeader>
          <CardTitle>Nuevo Estado</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{ORDER_STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="note">Nota (opcional)</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Motivo del cambio de estado"
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar Estado
              </Button>
              <Link href={`/admin/pedidos/${id}`}>
                <Button variant="outline" type="button">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
