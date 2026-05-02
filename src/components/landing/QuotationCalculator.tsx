"use client";

import { useQuotation } from "@/hooks/useQuotation";
import type { Service } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Sparkles, Eraser } from "lucide-react";

export function QuotationCalculator({ services }: { services: Service[] }) {
  const { lines, items, subtotal, igv, total, itemCount, setQuantity, reset } =
    useQuotation(services);

  const activeIds = new Set(lines.keys());

  return (
    <section id="cotizador" className="bg-slate-50 bg-dots px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="section-title reveal">Cotizador Inteligente</h2>
          <p className="section-subtitle reveal stagger-1 mx-auto max-w-xl">
            Calcule su cotización en tiempo real. Agregue servicios, ajuste cantidades y visualice el costo estimado al instante.
          </p>
        </div>

        <div className="reveal stagger-2 card-premium mt-14 overflow-hidden p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600">
            Seleccione sus servicios
          </h3>

          <div className="space-y-2">
            {services.map((service) => {
              const current = lines.get(service.id) || null;
              const isActive = activeIds.has(service.id);
              return (
                <div
                  key={service.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border border-transparent bg-gray-50 p-3 transition-all",
                    isActive && "border-brand-blue bg-brand-blue/5 animate-border-glow"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {service.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(service.base_price)} c/u
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const qty = current?.quantity || 0;
                        if (qty > 1) setQuantity(service.id, qty - 1);
                        else if (qty === 1) setQuantity(service.id, 0);
                        else setQuantity(service.id, 1);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded border bg-white text-gray-500 hover:bg-gray-100"
                      aria-label={isActive ? "Reducir" : "Agregar"}
                    >
                      {isActive ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                    </button>
                    {isActive && (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white">
                        {current!.quantity}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(service.id, (current?.quantity || 0) + 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded border bg-white text-gray-500 hover:bg-gray-100"
                      aria-label="Aumentar"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    {current && (
                      <span className="ml-1 w-20 text-right text-sm font-semibold text-gray-900">
                        {formatCurrency(service.base_price * current.quantity)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {itemCount === 0 && (
            <div className="mt-8 flex flex-col items-center gap-3 py-8 text-center">
              <Sparkles className="h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-400">
                Seleccione los servicios que necesita para iniciar su cotización.
              </p>
            </div>
          )}

          {itemCount > 0 && (
            <div className="mt-6 space-y-3 border-t pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                Resumen de Cotización
              </h3>

              {items.map((item) => (
                <div
                  key={item.service.id}
                  className="flex items-center gap-3 border-b border-gray-100 py-3 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.service.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.unitPrice)} c/u
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(item.service.id, Math.max(0, item.quantity - 1))
                      }
                      className="flex h-7 w-7 items-center justify-center rounded border text-gray-400 hover:bg-gray-100"
                      aria-label="Reducir"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.service.id, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded border text-gray-400 hover:bg-gray-100"
                      aria-label="Aumentar"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="w-24 text-right text-sm font-semibold text-gray-900">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}

              <div className="space-y-2 border-t border-dashed pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? "servicio" : "servicios"})</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>IGV (18%)</span>
                  <span>{formatCurrency(igv)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-lg font-bold text-brand-blue">Total</span>
                  <span className="gradient-text-red text-2xl font-extrabold">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="btn-primary flex-1 py-6 text-base font-semibold">
                  Solicitar Cotización
                </Button>
                <Button
                  variant="ghost"
                  onClick={reset}
                  className="btn-ghost-brand gap-2"
                >
                  <Eraser className="h-4 w-4" />
                  Limpiar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
