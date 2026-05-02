"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, Loader2, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Delivery, DeliveryStatus, DeliveryType, VehicleType } from "@/types";

const STATUS_LABELS: Record<DeliveryStatus, string> = {
  pendiente: "Pendiente",
  en_ruta: "En Ruta",
  completado: "Completado",
  fallido: "Fallido",
};

const STATUS_CLASSES: Record<DeliveryStatus, string> = {
  pendiente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  en_ruta: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  completado: "bg-green-100 text-green-800 hover:bg-green-100",
  fallido: "bg-red-100 text-red-800 hover:bg-red-100",
};

const TYPE_LABELS: Record<DeliveryType, string> = {
  recojo: "Recojo",
  entrega: "Entrega",
  ambos: "Ambos",
};

export default function EntregasPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("deliveries")
      .select("*, vehicle:vehicles(*)")
      .order("scheduled_date", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setDeliveries((data || []) as unknown as Delivery[]);
        setLoading(false);
      });
  }, []);

  const getItemsCount = (d: Delivery) => {
    return ((d as any).items?.length) || ((d as any).delivery_items?.length) || 0;
  };

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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-blue">Entregas</h2>
        <Link href="/admin/entregas/nueva">
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            <Plus className="h-4 w-4" />
            Nueva Entrega
          </Button>
        </Link>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha Programada</TableHead>
                <TableHead>Vehiculo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No hay entregas registradas
                  </TableCell>
                </TableRow>
              ) : (
                deliveries.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="text-sm">{formatDate(d.scheduled_date)}</TableCell>
                    <TableCell>{((d as any).vehicle as any)?.name || ((d as any).vehicle as any)?.plate || "—"}</TableCell>
                    <TableCell className="text-sm">{TYPE_LABELS[d.type]}</TableCell>
                    <TableCell className="text-center">{getItemsCount(d)}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_CLASSES[d.status]}>
                        {STATUS_LABELS[d.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/entregas/${d.id}/editar`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
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
