"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Calculator, Save } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Branch, Order } from "@/types";

export default function LiquidarSucursalPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const branchId = params.id as string;

  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  const [periodStart, setPeriodStart] = useState(searchParams.get("period_start") || "");
  const [periodEnd, setPeriodEnd] = useState(searchParams.get("period_end") || "");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("branches")
      .select("*")
      .eq("id", branchId)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setBranch(data);
        setLoading(false);
      });
  }, [branchId]);

  const totals = useMemo(() => {
    const totalAmount = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const commissionPct = branch?.commission_percent ?? 0;
    const commission = Number((totalAmount * commissionPct / 100).toFixed(2));
    return { orderCount: orders.length, totalAmount, commissionPct, commission };
  }, [orders, branch]);

  const handleCalculate = async () => {
    if (!periodStart || !periodEnd) {
      setError("Seleccione ambas fechas");
      return;
    }
    setCalculating(true);
    setError(null);

    const supabase = createClient();
    const endDate = new Date(periodEnd);
    endDate.setDate(endDate.getDate() + 1);

    const { data, error: err } = await supabase
      .from("orders")
      .select("*")
      .eq("branch_id", branchId)
      .gte("created_at", periodStart)
      .lt("created_at", endDate.toISOString().split("T")[0])
      .order("created_at", { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setOrders(data || []);
    }
    setCalculating(false);
  };

  const handleSubmit = async () => {
    if (orders.length === 0) {
      setError("No hay pedidos para liquidar en este periodo");
      return;
    }
    setSaving(true);
    setError(null);

    const supabase = createClient();

    const settlementItems = orders.map((o) => ({
      order_id: o.id,
      order_amount: Number(o.total),
      commission_pct: branch!.commission_percent,
      commission_amt: Number((Number(o.total) * branch!.commission_percent / 100).toFixed(2)),
    }));

    const { data: settlement, error: settlementErr } = await supabase
      .from("branch_settlements")
      .insert({
        branch_id: branchId,
        period_start: periodStart,
        period_end: periodEnd,
        total_orders_amount: totals.totalAmount,
        commission_amount: totals.commission,
        status: "pendiente",
        notes: null,
      })
      .select()
      .single();

    if (settlementErr) {
      setError(settlementErr.message);
      setSaving(false);
      return;
    }

    const itemsWithSettlement = settlementItems.map((item) => ({
      ...item,
      settlement_id: settlement.id,
    }));

    const { error: itemsErr } = await supabase
      .from("branch_settlement_items")
      .insert(itemsWithSettlement);

    if (itemsErr) {
      setError(itemsErr.message);
      setSaving(false);
      return;
    }

    router.push(`/admin/liquidaciones/${settlement.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error && !branch) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-600">Error: {error}</p>
        <Link href="/admin/sucursales"><Button variant="outline">Volver a Sucursales</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <Link href="/admin/sucursales" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue">
        <ArrowLeft className="h-4 w-4" />
        Volver a Sucursales
      </Link>
      <h2 className="text-2xl font-bold text-brand-blue">Liquidar Sucursal</h2>

      <Card>
        <CardHeader>
          <CardTitle>{branch?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Comision</p>
              <p className="font-medium">{branch?.commission_percent}%</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start">Desde</Label>
                <Input id="start" type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="end">Hasta</Label>
                <Input id="end" type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
              </div>
            </div>

            <Button onClick={handleCalculate} disabled={calculating} variant="outline" className="w-full">
              {calculating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calculator className="h-4 w-4" />}
              Calcular
            </Button>

            {orders.length > 0 && (
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pedidos encontrados</span>
                  <span className="font-medium">{totals.orderCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Pedidos</span>
                  <span className="font-medium">{formatCurrency(totals.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Comision ({totals.commissionPct}%)</span>
                  <span className="font-medium text-brand-blue">{formatCurrency(totals.commission)}</span>
                </div>

                <Button onClick={handleSubmit} disabled={saving} className="w-full bg-brand-blue hover:bg-brand-blue/90">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Crear Liquidacion
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
