"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, ArrowRightLeft } from "lucide-react";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS, SERVICE_CATEGORY_LABELS } from "@/types";
import type { Order, OrderStatus, OrderItem, OrderStatusLog, ServiceCategory } from "@/types";

const STATUS_CLASSES: Record<OrderStatus, string> = {
  cotizacion: "bg-yellow-100 text-yellow-800",
  confirmado: "bg-blue-100 text-blue-800",
  recolectado: "bg-indigo-100 text-indigo-800",
  en_proceso: "bg-orange-100 text-orange-800",
  control_calidad: "bg-purple-100 text-purple-800",
  listo: "bg-teal-100 text-teal-800",
  entregado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

export default function PedidoDetallePage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("orders")
      .select("*, order_items(*, service:services(*)), order_status_log(*)")
      .eq("id", id)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setOrder(data as unknown as Order);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-600">Error: {error || "Pedido no encontrado"}</p>
        <Link href="/admin/pedidos"><Button variant="outline">Volver a Pedidos</Button></Link>
      </div>
    );
  }

  const items = (order.order_items || []) as OrderItem[];
  const logs = ((order as any).order_status_log || order.status_logs || []) as OrderStatusLog[];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/pedidos" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue">
          <ArrowLeft className="h-4 w-4" />
          Volver a Pedidos
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-blue">Pedido #{order.id.slice(0, 8)}</h2>
          <p className="text-sm text-gray-500">{formatDateTime(order.created_at)}</p>
        </div>
        <Badge className={`text-sm px-3 py-1 ${STATUS_CLASSES[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Servicios</CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-gray-500 text-sm">Sin servicios</p>
              ) : (
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="font-medium">{(item as any).service?.name || "Servicio"}</p>
                        <p className="text-sm text-gray-500">
                          {SERVICE_CATEGORY_LABELS[(item as any).service?.category as ServiceCategory] || ""} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.subtotal)}</p>
                        <p className="text-xs text-gray-500">{formatCurrency(item.unit_price)} c/u</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Separator className="my-4" />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Descuento</span>
                  <span>{formatCurrency(order.discount || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">IGV (18%)</span>
                  <span>{formatCurrency(order.igv)}</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historial de Estados</CardTitle>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <p className="text-gray-500 text-sm">Sin historial</p>
              ) : (
                <div className="space-y-3">
                  {logs.map((log, i) => (
                    <div key={log.id || i} className="flex gap-3 text-sm">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-brand-blue mt-1.5" />
                        {i < logs.length - 1 && <div className="w-px h-full bg-gray-200 mt-1" />}
                      </div>
                      <div>
                        <p className="font-medium">{ORDER_STATUS_LABELS[log.status as OrderStatus] || log.status}</p>
                        {log.note && <p className="text-gray-500">{log.note}</p>}
                        <p className="text-xs text-gray-400">{formatDateTime(log.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informacion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Metodo de Pago</p>
                <p className="font-medium">{PAYMENT_METHOD_LABELS[order.payment_method]}</p>
              </div>
              <div>
                <p className="text-gray-500">Entrega</p>
                <p className="font-medium">{order.delivery_destination === "planta" ? "Planta" : order.delivery_destination === "domicilio" ? "Domicilio" : "Sucursal"}</p>
              </div>
              {order.delivery_address && (
                <div>
                  <p className="text-gray-500">Direccion</p>
                  <p className="font-medium">{order.delivery_address}</p>
                </div>
              )}
              {order.walk_in_name && (
                <div>
                  <p className="text-gray-500">Cliente (Mostrador)</p>
                  <p className="font-medium">{order.walk_in_name}</p>
                </div>
              )}
              {order.walk_in_phone && (
                <div>
                  <p className="text-gray-500">Telefono</p>
                  <p className="font-medium">{order.walk_in_phone}</p>
                </div>
              )}
              {order.notes && (
                <div>
                  <p className="text-gray-500">Notas</p>
                  <p>{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Link href={`/admin/pedidos/${id}/estado`}>
            <Button className="w-full bg-brand-blue hover:bg-brand-blue/90">
              <ArrowRightLeft className="h-4 w-4" />
              Cambiar Estado
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
