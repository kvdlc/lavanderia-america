"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, subtotal, itemCount, clearCart } = useCart();
  const [open, setOpen] = useState(false);

  const count = itemCount();
  const sub = subtotal();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 shadow-lg transition-all",
          count > 0
            ? "bg-brand-red text-white hover:brightness-110"
            : "bg-gray-200 text-gray-500"
        )}
        aria-label="Carrito"
      >
        <ShoppingCart className="h-5 w-5" />
        {count > 0 && (
          <span className="font-semibold">
            {count} {count === 1 ? "item" : "items"}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-bold text-brand-blue">
                Carrito ({count})
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Cerrar">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex h-[calc(100%-136px)] flex-col overflow-y-auto p-4">
              {items.length === 0 ? (
                <p className="py-12 text-center text-gray-400">
                  Su carrito est&aacute; vac&iacute;o.
                </p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.service.id}
                    className="flex items-center gap-3 border-b py-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.service.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(item.service.base_price)} c/u
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.service.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded border text-gray-500 hover:bg-gray-100"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded border text-gray-500 hover:bg-gray-100"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="w-20 text-right text-sm font-semibold">
                      {formatCurrency(item.service.base_price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.service.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-4">
                <div className="mb-2 flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(sub)}</span>
                </div>
                <div className="mb-2 flex justify-between text-sm text-gray-600">
                  <span>IGV (18%)</span>
                  <span>{formatCurrency(sub * 0.18)}</span>
                </div>
                <div className="mb-4 flex justify-between font-bold text-brand-blue">
                  <span>Total</span>
                  <span>{formatCurrency(sub * 1.18)}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => clearCart()}
                  >
                    Vaciar
                  </Button>
                  <Link href="/checkout" className="flex-1">
                    <Button size="sm" className="w-full bg-brand-red hover:brightness-110">
                      Cotizar
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
