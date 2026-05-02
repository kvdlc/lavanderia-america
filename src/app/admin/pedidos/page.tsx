"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Eye, Loader2 } from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/types";
import type { Order, OrderStatus } from "@/types";

const STATUS_CLASSES: Record<OrderStatus, string> = {
  cotizacion: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  confirmado: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  recolectado: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  en_proceso: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  control_calidad: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  listo: "bg-teal-100 text-teal-800 hover:bg-teal-100",
  entregado: "bg-green-100 text-green-800 hover:bg-green-100",
  cancelado: "bg-red-100 text-red-800 hover:bg-red-100",
};

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("orders")
      .select("*, client:profiles(full_name)")
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setOrders((data || []) as unknown as Order[]);
        setLoading(false);
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
        <Button variant="outline" onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
      </div>
      <h2 className="text-2xl font-bold text-brand-blue">Pedidos</h2>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    No hay pedidos registrados
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">#{o.id.slice(0, 8)}</TableCell>
                    <TableCell>{((o as any).client as any)?.full_name || o.walk_in_name || "—"}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_CLASSES[o.status] || ""}>
                        {ORDER_STATUS_LABELS[o.status] || o.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(o.total)}</TableCell>
                    <TableCell>{PAYMENT_METHOD_LABELS[o.payment_method] || o.payment_method}</TableCell>
                    <TableCell className="text-sm text-gray-500">{formatDate(o.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/pedidos/${o.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
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
