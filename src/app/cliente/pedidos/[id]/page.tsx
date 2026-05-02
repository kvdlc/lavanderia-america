"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, Check, Circle } from "lucide-react";
import { formatCurrency, formatDate, formatDateTime, cn } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  SERVICE_CATEGORY_LABELS,
} from "@/types";
import type {
  Order,
  OrderStatus,
  OrderItem,
  OrderStatusLog,
  ServiceCategory,
} from "@/types";

const ORDER_STATUS_FLOW: OrderStatus[] = [
  "cotizacion",
  "confirmado",
  "recolectado",
  "en_proceso",
  "control_calidad",
  "listo",
  "entregado",
];

const STATUS_CLASSES: Record<OrderStatus, string> = {
  cotizacion: "bg-amber-100 text-amber-800",
  confirmado: "bg-blue-100 text-blue-800",
  recolectado: "bg-indigo-100 text-indigo-800",
  en_proceso: "bg-purple-100 text-purple-800",
  control_calidad: "bg-orange-100 text-orange-800",
  listo: "bg-green-100 text-green-800",
  entregado: "bg-emerald-100 text-emerald-800",
  cancelado: "bg-red-100 text-red-800",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  fallido: "Fallido",
  reembolsado: "Reembolsado",
};

export default function ClientePedidoDetallePage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [logs, setLogs] = useState<OrderStatusLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        setError("No autorizado");
        setLoading(false);
        return;
      }

      supabase
        .from("orders")
        .select("*, order_items(*, service:services(*)), order_status_log(*)")
        .eq("id", id)
        .eq("client_id", data.user.id)
        .single()
        .then(({ data: orderData, error: err }) => {
          if (err) {
            setError(err.message);
            setLoading(false);
            return;
          }

          const o = orderData as unknown as Order;
          setOrder(o);
          setLogs(
            ((o as any).order_status_log || []) as OrderStatusLog[]
          );
          setLoading(false);

          const channel = supabase
            .channel("order_status_log_changes")
            .on(
              "postgres_changes",
              {
                event: "INSERT",
                schema: "public",
                table: "order_status_log",
                filter: `order_id=eq.${id}`,
              },
              (payload) => {
                const newLog = payload.new as OrderStatusLog;
                setLogs((prev) => [...prev, newLog]);
                setOrder((prev) =>
                  prev ? { ...prev, status: newLog.status } : prev
                );
              }
            )
            .subscribe();

          return () => {
            supabase.removeChannel(channel);
          };
        });
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
        <p className="text-red-600">
          {error || "Pedido no encontrado"}
        </p>
        <Link href="/cliente/pedidos">
          <span className="text-sm text-brand-blue hover:underline">
            Volver a Mis Pedidos
          </span>
        </Link>
      </div>
    );
  }

  const items = (order.order_items || []) as OrderItem[];
  const currentIdx = ORDER_STATUS_FLOW.indexOf(order.status);
  const isCancelled = order.status === "cancelado";

  return (
    <div className="space-y-6">
      <Link
        href="/cliente/pedidos"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Mis Pedidos
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-brand-blue">
            Pedido #{order.id.slice(0, 8)}
          </h2>
          <p className="text-sm text-gray-500">
            {formatDateTime(order.created_at)}
          </p>
        </div>
        <Badge
          className={cn("text-sm px-3 py-1", STATUS_CLASSES[order.status])}
        >
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
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">
                          {(item as any).service?.name || "Servicio"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {SERVICE_CATEGORY_LABELS[
                            (item as any).service?.category as ServiceCategory
                          ] || ""}{" "}
                          × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(item.subtotal)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(item.unit_price)} c/u
                        </p>
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
                  <span className="text-brand-red">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seguimiento del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {ORDER_STATUS_FLOW.map((status, i) => {
                  const completed = isCancelled
                    ? false
                    : i <= currentIdx;
                  const isCurrent = i === currentIdx && !isCancelled;
                  const logEntry = logs.find(
                    (l) => l.status === status
                  );

                  return (
                    <div key={status} className="flex gap-3 text-sm">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border-2",
                            completed
                              ? "bg-brand-blue border-brand-blue text-white"
                              : isCurrent
                              ? "border-brand-blue text-brand-blue"
                              : "border-gray-200 text-gray-300"
                          )}
                        >
                          {completed ? (
                            <Check className="h-3 w-3" />
                          ) : isCurrent ? (
                            <Circle className="h-3 w-3" />
                          ) : (
                            <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                          )}
                        </div>
                        {i < ORDER_STATUS_FLOW.length - 1 && (
                          <div
                            className={cn(
                              "w-px flex-1 min-h-6",
                              i < currentIdx
                                ? "bg-brand-blue"
                                : "bg-gray-200"
                            )}
                          />
                        )}
                      </div>
                      <div className="pb-5">
                        <p
                          className={cn(
                            "font-medium",
                            completed || isCurrent
                              ? "text-gray-900"
                              : "text-gray-400"
                          )}
                        >
                          {ORDER_STATUS_LABELS[status]}
                        </p>
                        {logEntry && (
                          <>
                            <p className="text-xs text-gray-400">
                              {formatDateTime(logEntry.created_at)}
                            </p>
                            {logEntry.note && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {logEntry.note}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isCancelled && (
                  <div className="flex gap-3 text-sm">
                    <div className="flex flex-col items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white border-2 border-red-500">
                        <Check className="h-3 w-3" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-red-600">
                        {ORDER_STATUS_LABELS.cancelado}
                      </p>
                      {logs.find((l) => l.status === "cancelado") && (
                        <p className="text-xs text-gray-400">
                          {formatDateTime(
                            logs.find((l) => l.status === "cancelado")!
                              .created_at
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informacion del Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Metodo de Pago</p>
                <p className="font-medium">
                  {PAYMENT_METHOD_LABELS[order.payment_method]}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Estado de Pago</p>
                <p className="font-medium">
                  {PAYMENT_STATUS_LABELS[order.payment_status] ||
                    order.payment_status}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-gray-500">Destino de Entrega</p>
                <p className="font-medium">
                  {order.delivery_destination === "planta"
                    ? "Planta"
                    : order.delivery_destination === "domicilio"
                    ? "Domicilio"
                    : "Sucursal"}
                </p>
              </div>
              {order.delivery_address && (
                <div>
                  <p className="text-gray-500">Direccion</p>
                  <p className="font-medium">{order.delivery_address}</p>
                </div>
              )}
              {order.estimated_delivery && (
                <div>
                  <p className="text-gray-500">Entrega Estimada</p>
                  <p className="font-medium">
                    {formatDate(order.estimated_delivery)}
                  </p>
                </div>
              )}
              {order.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-gray-500">Notas</p>
                    <p>{order.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
