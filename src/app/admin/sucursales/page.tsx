"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, Loader2, Pencil, Coins } from "lucide-react";
import type { Branch, BillingCycle } from "@/types";

const CYCLE_LABELS: Record<BillingCycle, string> = {
  semanal: "Semanal",
  quincenal: "Quincenal",
  mensual: "Mensual",
  personalizado: "Personalizado",
};

export default function SucursalesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("branches")
      .select("*")
      .order("name", { ascending: true })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setBranches(data || []);
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
        <h2 className="text-2xl font-bold text-brand-blue">Sucursales</h2>
        <Link href="/admin/sucursales/nueva">
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            <Plus className="h-4 w-4" />
            Nueva Sucursal
          </Button>
        </Link>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead className="text-center">Comision (%)</TableHead>
                <TableHead>Ciclo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No hay sucursales registradas
                  </TableCell>
                </TableRow>
              ) : (
                branches.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{b.contact_person || "—"}</p>
                        {b.phone && <p className="text-gray-500">{b.phone}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{b.commission_percent}%</TableCell>
                    <TableCell>{CYCLE_LABELS[b.billing_cycle]}</TableCell>
                    <TableCell>
                      <Badge className={b.active ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-600 hover:bg-gray-100"}>
                        {b.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/sucursales/${b.id}/liquidar`}>
                          <Button variant="ghost" size="icon" title="Liquidar">
                            <Coins className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/sucursales/${b.id}/editar`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
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
