"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, Loader2, Pencil } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { SERVICE_CATEGORY_LABELS } from "@/types";
import type { Service } from "@/types";

export default function ServiciosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setServices(data || []);
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-blue">Servicios</h2>
        <Link href="/admin/servicios/nuevo">
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            <Plus className="h-4 w-4" />
            Nuevo Servicio
          </Button>
        </Link>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Precio Base</TableHead>
                <TableHead className="text-center">Orden</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No hay servicios registrados
                  </TableCell>
                </TableRow>
              ) : (
                services.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{SERVICE_CATEGORY_LABELS[s.category] || s.category}</TableCell>
                    <TableCell className="text-right">{formatCurrency(s.base_price)}</TableCell>
                    <TableCell className="text-center">{s.display_order}</TableCell>
                    <TableCell>
                      <Badge className={s.active ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-600 hover:bg-gray-100"}>
                        {s.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/servicios/${s.id}/editar`}>
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
