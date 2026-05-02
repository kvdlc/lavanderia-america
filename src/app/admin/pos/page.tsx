"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, Plus, Minus, Trash2, ShoppingCart, User } from "lucide-react";
import { formatCurrency, calculateIGV, calculateTotal, cn } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS } from "@/types";
import type { Service, PaymentMethod } from "@/types";

interface PosItem {
  service: Service;
  quantity: number;
}

const PAYMENT_METHODS = Object.entries(PAYMENT_METHOD_LABELS).filter(([k]) => k !== "pendiente") as [PaymentMethod, string][];

export default function PosPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<PosItem[]>([]);
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo");
  const [deliveryDest, setDeliveryDest] = useState("planta");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setServices(data || []);
        setLoading(false);
      });
  }, []);

  const addToCart = (service: Service) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.service.id === service.id);
      if (existing) {
        return prev.map((i) => (i.service.id === service.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { service, quantity: 1 }];
    });
  };

  const updateQuantity = (serviceId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.service.id === serviceId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (serviceId: string) => {
    setCart((prev) => prev.filter((i) => i.service.id !== serviceId));
  };

  const subtotal = useMemo(() => cart.reduce((sum, i) => sum + i.service.base_price * i.quantity, 0), [cart]);
  const igv = useMemo(() => calculateIGV(subtotal), [subtotal]);
  const total = useMemo(() => calculateTotal(subtotal), [subtotal]);

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setSaving(true);
    setError(null);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map((i) => ({ service_id: i.service.id, quantity: i.quantity })),
        source: "pos",
        payment_method: paymentMethod,
        delivery_destination: deliveryDest,
        delivery_address: deliveryAddress || null,
        walk_in_name: walkInName || null,
        walk_in_phone: walkInPhone || null,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Error al registrar venta");
      setSaving(false);
    } else {
      router.push("/admin/pedidos");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error && services.length === 0) {
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
      <h2 className="text-2xl font-bold text-brand-blue">Punto de Venta</h2>

      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Servicios Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => addToCart(s)}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-brand-blue hover:bg-brand-blue/5 transition-colors text-left"
                  >
                    <span className="font-medium text-sm text-center">{s.name}</span>
                    <span className="text-lg font-bold text-brand-blue">{formatCurrency(s.base_price)}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue">Agregar</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {cart.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Items ({cart.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {cart.map((item) => (
                    <div key={item.service.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div className="flex-1">
                        <p className="font-medium">{item.service.name}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(item.service.base_price)} c/u</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.service.id, -1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.service.id, 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removeItem(item.service.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="ml-4 font-medium">{formatCurrency(item.service.base_price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente de Mostrador
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="wname">Nombre</Label>
                <Input id="wname" value={walkInName} onChange={(e) => setWalkInName(e.target.value)} placeholder="Opcional" />
              </div>
              <div>
                <Label htmlFor="wphone">Telefono</Label>
                <Input id="wphone" value={walkInPhone} onChange={(e) => setWalkInPhone(e.target.value)} placeholder="Opcional" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">IGV (18%)</span>
                <span>{formatCurrency(igv)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-brand-blue">{formatCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <div>
                <Label htmlFor="pmethod">Metodo de Pago</Label>
                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                  <SelectTrigger id="pmethod">
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
                <Label htmlFor="ddest">Destino de Entrega</Label>
                <Select value={deliveryDest} onValueChange={setDeliveryDest}>
                  <SelectTrigger id="ddest">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planta">Planta</SelectItem>
                    <SelectItem value="domicilio">Domicilio</SelectItem>
                    <SelectItem value="sucursal">Sucursal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {deliveryDest === "domicilio" && (
                <div>
                  <Label htmlFor="daddr">Direccion</Label>
                  <Input id="daddr" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Direccion de entrega" />
                </div>
              )}
              <Button
                className="w-full bg-brand-blue hover:bg-brand-blue/90"
                disabled={cart.length === 0 || saving}
                onClick={handleSubmit}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
                Registrar Venta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
