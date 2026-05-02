"use client";

import { useQuotation, type QuotationLine } from "@/hooks/useQuotation";
import type { Service } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2 } from "lucide-react";

function QuotationRow({
  line,
  onQuantityChange,
  onRemove,
}: {
  line: QuotationLine;
  onQuantityChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  const { service, quantity } = line;
  const subtotal = service.base_price * quantity;

  return (
    <div className="flex items-center gap-3 border-b py-3 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{service.name}</p>
        <p className="text-xs text-gray-500">{formatCurrency(service.base_price)} c/u</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onQuantityChange(service.id, Math.max(1, quantity - 1))}
          className="flex h-8 w-8 items-center justify-center rounded border text-gray-500 hover:bg-gray-100"
          aria-label="Reducir cantidad"
        >
          <Minus className="h-3 w-3" />
        </button>
        <Input
          type="number"
          min={0}
          value={quantity}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            onQuantityChange(service.id, isNaN(v) ? 0 : v);
          }}
          className="h-8 w-16 text-center text-sm"
        />
        <button
          type="button"
          onClick={() => onQuantityChange(service.id, quantity + 1)}
          className="flex h-8 w-8 items-center justify-center rounded border text-gray-500 hover:bg-gray-100"
          aria-label="Aumentar cantidad"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
      <span className="w-24 text-right text-sm font-semibold text-gray-900">
        {formatCurrency(subtotal)}
      </span>
      <button
        type="button"
        onClick={() => onRemove(service.id)}
        className="ml-1 text-gray-400 hover:text-red-500"
        aria-label="Eliminar item"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function QuotationSummary({
  subtotal,
  igv,
  total,
  itemCount,
}: {
  subtotal: number;
  igv: number;
  total: number;
  itemCount: number;
}) {
  return (
    <div className="space-y-2 border-t pt-4">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Subtotal ({itemCount} items)</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>IGV (18%)</span>
        <span>{formatCurrency(igv)}</span>
      </div>
      <div className="flex justify-between border-t pt-2 text-lg font-bold text-brand-blue">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

export function QuotationCalculator({ services }: { services: Service[] }) {
  const { lines, items, subtotal, igv, total, itemCount, setQuantity, removeLine, reset } =
    useQuotation(services);

  return (
    <section id="cotizador" className="bg-slate-50 px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <div className="brand-divider-red mx-auto mb-4" />
          <h2 className="section-title">Cotizador en Tiempo Real</h2>
          <p className="section-subtitle mx-auto max-w-xl">
            Ingrese las cantidades y obtenga el costo estimado al instante, IGV incluido.
          </p>
        </div>

        <div className="card mt-14 p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Seleccione sus servicios
          </h3>

          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center gap-4 border-b py-3 last:border-0"
            >
              <p className="flex-1 text-sm font-medium text-gray-900">{service.name}</p>
              <p className="text-xs text-gray-500">{formatCurrency(service.base_price)} c/u</p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const current = lines.get(service.id)?.quantity || 0;
                    if (current > 0) setQuantity(service.id, current - 1);
                    else setQuantity(service.id, 1);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded border text-gray-500 hover:bg-gray-100"
                  aria-label={
                    (lines.get(service.id)?.quantity || 0) > 0
                      ? "Reducir"
                      : "Agregar"
                  }
                >
                  {(lines.get(service.id)?.quantity || 0) > 0 ? (
                    <Minus className="h-3 w-3" />
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                </button>
                <Input
                  type="number"
                  min={0}
                  value={lines.get(service.id)?.quantity || ""}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    setQuantity(service.id, isNaN(v) ? 0 : v);
                  }}
                  placeholder="0"
                  className="h-8 w-16 text-center text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    const current = lines.get(service.id)?.quantity || 0;
                    setQuantity(service.id, current + 1);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded border text-gray-500 hover:bg-gray-100"
                  aria-label="Aumentar"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}

          {itemCount > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">Resumen</h3>
              {Array.from(lines.values()).map((line) => (
                <QuotationRow
                  key={line.service.id}
                  line={line}
                  onQuantityChange={setQuantity}
                  onRemove={removeLine}
                />
              ))}
              <QuotationSummary
                subtotal={subtotal}
                igv={igv}
                total={total}
                itemCount={itemCount}
              />
              <div className="mt-4 flex gap-3">
                <Button
                  className="flex-1 bg-brand-red hover:brightness-110"
                  onClick={() => {}}
                >
                  Solicitar Cotizaci&oacute;n
                </Button>
                <Button variant="outline" onClick={reset}>
                  Limpiar
                </Button>
              </div>
            </div>
          )}

          {itemCount === 0 && (
            <p className="mt-6 text-center text-sm text-gray-400">
              Ingrese cantidades en los servicios para ver el resumen.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
