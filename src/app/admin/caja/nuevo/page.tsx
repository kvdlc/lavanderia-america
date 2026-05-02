"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { TRANSACTION_CATEGORY_LABELS, PAYMENT_METHOD_LABELS } from "@/types";
import type { TransactionType, TransactionCategory, PaymentMethod } from "@/types";

const INGRESO_CATEGORIES: TransactionCategory[] = ["venta", "liquidacion_sucursal", "otro"];
const EGRESO_CATEGORIES: TransactionCategory[] = ["gasto_operativo", "gasto_movilidad", "gasto_insumos", "otro"];
const PAYMENT_METHODS = Object.entries(PAYMENT_METHOD_LABELS) as [PaymentMethod, string][];

export default function NuevoMovimientoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<TransactionType>("ingreso");
  const [category, setCategory] = useState<TransactionCategory>("venta");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo");
  const [description, setDescription] = useState("");

  const availableCategories = useMemo(() => {
    return type === "ingreso" ? INGRESO_CATEGORIES : EGRESO_CATEGORIES;
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError("El monto debe ser mayor a 0");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: err } = await supabase.from("transactions").insert({
      type,
      category,
      amount: Number(amount),
      payment_method: paymentMethod,
      description: description || null,
    });

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      router.push("/admin/caja");
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <Link href="/admin/caja" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue">
        <ArrowLeft className="h-4 w-4" />
        Volver a Caja
      </Link>
      <h2 className="text-2xl font-bold text-brand-blue">Nuevo Movimiento</h2>

      <Card>
        <CardHeader>
          <CardTitle>Registrar Movimiento</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={type} onValueChange={(v) => { setType(v as TransactionType); setCategory(v === "ingreso" ? "venta" : "gasto_operativo"); }}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingreso">Ingreso</SelectItem>
                  <SelectItem value="egreso">Egreso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as TransactionCategory)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{TRANSACTION_CATEGORY_LABELS[cat]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Monto (S/)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="payment">Metodo de Pago</Label>
              <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                <SelectTrigger id="payment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="desc">Descripcion (opcional)</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalle del movimiento"
                rows={2}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar Movimiento
              </Button>
              <Link href="/admin/caja">
                <Button variant="outline" type="button">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
