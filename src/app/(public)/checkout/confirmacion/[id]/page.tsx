import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/types";
import type { Order } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ConfirmacionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { id } = await params;
  const { status: paymentStatus } = await searchParams;

  let order: Order | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (data) order = data as Order;
  } catch {
    // ignore
  }

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      {paymentStatus === "transferencia" ? (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue">
            <span className="text-3xl font-extrabold text-white">&#10003;</span>
          </div>
          <h1 className="text-3xl font-extrabold text-brand-blue">
            Cotizaci&oacute;n Recibida
          </h1>
          <p className="mt-4 text-gray-600">
            Su pedido ha sido registrado. Un asesor revisar&aacute; su cotizaci&oacute;n y se
            pondr&aacute; en contacto para coordinar el pago por transferencia.
          </p>
        </>
      ) : (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-red">
            <span className="text-3xl font-extrabold text-white">!</span>
          </div>
          <h1 className="text-3xl font-extrabold text-brand-blue">
            Pago Pendiente
          </h1>
          <p className="mt-4 text-gray-600">
            El pago a&uacute;n no se ha procesado. Ser&aacute; redirigido a Izipay para completar
            el pago. (Integraci&oacute;n pendiente)
          </p>
        </>
      )}

      <div className="card mx-auto mt-10 max-w-md p-6 text-left">
        <h3 className="mb-4 text-base font-bold text-brand-blue">Detalles del Pedido</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">N&deg; Pedido</span>
            <span className="font-mono font-medium">{order.id.slice(0, 8)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Estado</span>
            <span className="font-medium text-brand-blue">
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">M&eacute;todo de Pago</span>
            <span className="font-medium">
              {PAYMENT_METHOD_LABELS[order.payment_method]}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Fecha</span>
            <span className="font-medium">{formatDate(order.created_at)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-base">
            <span className="font-bold text-brand-blue">Total</span>
            <span className="font-bold text-brand-red">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Link href="/tienda">
          <Button variant="outline">Volver a la Tienda</Button>
        </Link>
        <Link href="/">
          <Button className="bg-brand-blue hover:brightness-110">Inicio</Button>
        </Link>
      </div>
    </div>
  );
}
