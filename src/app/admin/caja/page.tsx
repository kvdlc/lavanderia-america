"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Loader2, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { TRANSACTION_CATEGORY_LABELS, PAYMENT_METHOD_LABELS } from "@/types";
import type { Transaction, TransactionType, TransactionCategory } from "@/types";

type FilterType = "todos" | "ingreso" | "egreso";

export default function CajaPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("todos");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setTransactions(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    if (filter === "todos") return transactions;
    return transactions.filter((t) => t.type === filter);
  }, [transactions, filter]);

  const { totalIngresos, totalEgresos } = useMemo(() => {
    let ingresos = 0;
    let egresos = 0;
    transactions.forEach((t) => {
      if (t.type === "ingreso") ingresos += Number(t.amount);
      else egresos += Number(t.amount);
    });
    return { totalIngresos: ingresos, totalEgresos: egresos };
  }, [transactions]);

  const saldo = totalIngresos - totalEgresos;

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

  const filterButtons: { value: FilterType; label: string }[] = [
    { value: "todos", label: "Todos" },
    { value: "ingreso", label: "Ingresos" },
    { value: "egreso", label: "Egresos" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-blue">Caja Chica</h2>
        <Link href="/admin/caja/nuevo">
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            <Plus className="h-4 w-4" />
            Nuevo Movimiento
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Ingresos</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIngresos)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Egresos</CardTitle>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalEgresos)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Saldo</CardTitle>
            <Wallet className={`h-5 w-5 ${saldo >= 0 ? "text-emerald-600" : "text-red-600"}`} />
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${saldo >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {formatCurrency(saldo)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        {filterButtons.map((btn) => (
          <Button
            key={btn.value}
            variant={filter === btn.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(btn.value)}
            className={filter === btn.value ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
          >
            {btn.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Metodo</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Descripcion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No hay movimientos registrados
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-sm text-gray-500">{formatDateTime(t.created_at)}</TableCell>
                    <TableCell>
                      <Badge className={t.type === "ingreso" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"}>
                        {t.type === "ingreso" ? "Ingreso" : "Egreso"}
                      </Badge>
                    </TableCell>
                    <TableCell>{TRANSACTION_CATEGORY_LABELS[t.category as TransactionCategory] || t.category}</TableCell>
                    <TableCell className="text-sm">{PAYMENT_METHOD_LABELS[t.payment_method] || t.payment_method}</TableCell>
                    <TableCell className={`text-right font-medium ${t.type === "ingreso" ? "text-green-600" : "text-red-600"}`}>
                      {t.type === "ingreso" ? "+" : "-"}{formatCurrency(t.amount)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 max-w-xs truncate">{t.description || "—"}</TableCell>
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
