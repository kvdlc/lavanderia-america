"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, ShoppingBag } from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/types";
import type { Order, OrderStatus } from "@/types";

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

export default function ClientePedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
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
        .select("*")
        .eq("client_id", data.user.id)
        .order("created_at", { ascending: false })
        .then(({ data: ordersData, error: err }) => {
          if (err) setError(err.message);
          else setOrders((ordersData || []) as unknown as Order[]);
          setLoading(false);
        });
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
        <Package className="h-12 w-12 text-gray-300" />
        <div>
          <p className="text-lg font-medium text-gray-600">Aun no tiene pedidos</p>
          <p className="text-sm text-gray-400 mt-1">Realice su primer pedido desde la tienda</p>
        </div>
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 rounded-md bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue/90"
        >
          <ShoppingBag className="h-4 w-4" />
          Ir a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/cliente/pedidos/${order.id}`}>
            <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-gray-400">
                      #{order.id.slice(0, 8)}
                    </p>
                    <Badge
                      className={cn(
                        "text-xs font-medium",
                        STATUS_CLASSES[order.status]
                      )}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>{formatDate(order.created_at)}</span>
                      <span>{PAYMENT_METHOD_LABELS[order.payment_method]}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-lg font-bold text-brand-red">
                      {formatCurrency(order.total)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.order_items?.length ?? 0} items
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
