"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

type PaymentMethod = "izipay" | "transferencia";
type DeliveryDest = "planta" | "domicilio";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, igv, total, itemCount, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("transferencia");
  const [deliveryDest, setDeliveryDest] = useState<DeliveryDest>("planta");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sub = subtotal();
  const ig = igv();
  const tot = total();

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const orderData = {
      source: "web" as const,
      items: items.map((i) => ({
        service_id: i.service.id,
        quantity: i.quantity,
        unit_price: i.service.base_price,
      })),
      payment_method: paymentMethod,
      delivery_destination: deliveryDest,
      delivery_address: deliveryDest === "domicilio" ? deliveryAddress : undefined,
      notes: notes || undefined,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al crear el pedido");
      }

      const { data } = await res.json();
      clearCart();

      if (paymentMethod === "izipay") {
        router.push(`/checkout/confirmacion/${data.id}?status=pendiente`);
      } else {
        router.push(`/checkout/confirmacion/${data.id}?status=transferencia`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Carrito vac&iacute;o</h2>
        <p className="mt-2 text-gray-600">Agregue servicios antes de continuar.</p>
        <Link href="/tienda">
          <Button className="mt-6 bg-brand-blue hover:brightness-110">Ir a la Tienda</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <Link
        href="/tienda"
        className="mb-8 inline-flex items-center text-sm text-gray-500 hover:text-brand-blue"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Volver a la tienda
      </Link>

      <h1 className="text-3xl font-extrabold text-brand-blue">Solicitar Cotizaci&oacute;n</h1>
      <p className="mt-2 text-gray-600">Revise su pedido y seleccione el m&eacute;todo de pago.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="card p-6">
            <h3 className="mb-4 text-base font-bold text-brand-blue">Resumen del Pedido</h3>
            {items.map((item) => (
              <div key={item.service.id} className="flex justify-between border-b py-2 text-sm">
                <span>
                  {item.service.name} x{item.quantity}
                </span>
                <span className="font-medium">
                  {formatCurrency(item.service.base_price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({itemCount()} items)</span>
                <span>{formatCurrency(sub)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>IGV (18%)</span>
                <span>{formatCurrency(ig)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-lg font-bold text-brand-blue">
                <span>Total</span>
                <span>{formatCurrency(tot)}</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="mb-4 text-base font-bold text-brand-blue">Entrega</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Destino de entrega</Label>
                <Select
                  value={deliveryDest}
                  onValueChange={(v) => setDeliveryDest(v as DeliveryDest)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planta">Recojo en Planta</SelectItem>
                    <SelectItem value="domicilio">Env&iacute;o a domicilio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {deliveryDest === "domicilio" && (
                <div className="space-y-2">
                  <Label htmlFor="address">Direcci&oacute;n</Label>
                  <Input
                    id="address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Av. Principal 123, Ciudad"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="mb-4 text-base font-bold text-brand-blue">M&eacute;todo de Pago</h3>
            <div className="space-y-2">
              <Label>Seleccione</Label>
              <Select
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                  <SelectItem value="izipay">Pago con Tarjeta (Izipay)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas adicionales</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instrucciones especiales (opcional)"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card sticky top-24 p-6">
            <h3 className="mb-1 text-lg font-bold text-brand-blue">Total a Pagar</h3>
            <p className="text-3xl font-extrabold text-brand-red">{formatCurrency(tot)}</p>
            <p className="mt-1 text-xs text-gray-500">IGV incluido</p>

            {error && (
              <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>
            )}

            <Button
              className="mt-4 w-full bg-brand-red py-6 text-lg hover:brightness-110"
              onClick={handleSubmit}
              disabled={loading || (deliveryDest === "domicilio" && !deliveryAddress)}
            >
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {paymentMethod === "izipay" ? "Pagar con Izipay" : "Solicitar Cotizaci&oacute;n"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
