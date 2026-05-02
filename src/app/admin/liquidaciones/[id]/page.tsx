"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { BranchSettlement, BranchSettlementItem, SettlementStatus } from "@/types";

const STATUS_LABELS: Record<SettlementStatus, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  anulado: "Anulado",
};

const STATUS_CLASSES: Record<SettlementStatus, string> = {
  pendiente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  pagado: "bg-green-100 text-green-800 hover:bg-green-100",
  anulado: "bg-red-100 text-red-800 hover:bg-red-100",
};

export default function LiquidacionDetallePage() {
  const params = useParams();
  const id = params.id as string;
  const [settlement, setSettlement] = useState<BranchSettlement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingPaid, setMarkingPaid] = useState(false);

  const fetchSettlement = () => {
    const supabase = createClient();
    supabase
      .from("branch_settlements")
      .select("*, branch:branches(*), items:branch_settlement_items(*)")
      .eq("id", id)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setSettlement(data as unknown as BranchSettlement);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSettlement();
  }, [id]);

  const handleMarkPaid = async () => {
    setMarkingPaid(true);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("branch_settlements")
      .update({ status: "pagado", paid_at: new Date().toISOString() })
      .eq("id", id);

    if (err) {
      setError(err.message);
    } else {
      fetchSettlement();
    }
    setMarkingPaid(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error || !settlement) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-600">Error: {error || "Liquidacion no encontrada"}</p>
        <Link href="/admin/sucursales"><Button variant="outline">Volver a Sucursales</Button></Link>
      </div>
    );
  }

  const branch = (settlement as any).branch;
  const items = settlement.items || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/sucursales" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue">
          <ArrowLeft className="h-4 w-4" />
          Volver a Sucursales
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-blue">Liquidacion</h2>
          <p className="text-sm text-gray-500">{branch?.name || `Sucursal #${settlement.branch_id.slice(0, 8)}`}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`text-sm px-3 py-1 ${STATUS_CLASSES[settlement.status]}`}>
            {STATUS_LABELS[settlement.status]}
          </Badge>
          {settlement.status === "pendiente" && (
            <Button onClick={handleMarkPaid} disabled={markingPaid} className="bg-green-600 hover:bg-green-700">
              {markingPaid ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Marcar Pagado
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Periodo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{formatDate(settlement.period_start)} – {formatDate(settlement.period_end)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{formatCurrency(settlement.total_orders_amount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Comision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-brand-blue">{formatCurrency(settlement.commission_amount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pagado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{settlement.paid_at ? formatDate(settlement.paid_at) : "—"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos Incluidos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="text-right">Comision %</TableHead>
                <TableHead className="text-right">Comision</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                    Sin pedidos en esta liquidacion
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">#{item.order_id.slice(0, 8)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.order_amount)}</TableCell>
                    <TableCell className="text-right">{item.commission_pct}%</TableCell>
                    <TableCell className="text-right text-brand-blue font-medium">{formatCurrency(item.commission_amt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {settlement.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{settlement.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
