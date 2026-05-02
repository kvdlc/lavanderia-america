"use client";

import { useState, useMemo, useCallback } from "react";
import type { Service } from "@/types";
import { calculateItemSubtotal, calculateIGV, calculateTotal } from "@/lib/pricing";

const IGV_RATE = 0.18;

export interface QuotationLine {
  service: Service;
  quantity: number;
}

export function useQuotation(services: Service[]) {
  const [lines, setLines] = useState<Map<string, QuotationLine>>(new Map());

  const setQuantity = useCallback((serviceId: string, quantity: number) => {
    setLines((prev) => {
      const next = new Map(prev);
      if (quantity <= 0) {
        next.delete(serviceId);
      } else {
        const service = services.find((s) => s.id === serviceId);
        if (service) {
          next.set(serviceId, { service, quantity });
        }
      }
      return next;
    });
  }, [services]);

  const removeLine = useCallback((serviceId: string) => {
    setLines((prev) => {
      const next = new Map(prev);
      next.delete(serviceId);
      return next;
    });
  }, []);

  const items = useMemo(() => {
    return Array.from(lines.values()).map((line) => {
      const subtotal = calculateItemSubtotal(line.service.base_price, line.quantity);
      return {
        service: line.service,
        quantity: line.quantity,
        unitPrice: line.service.base_price,
        subtotal,
      };
    });
  }, [lines]);

  const subtotal = useMemo(
    () => items.reduce((acc, i) => acc + i.subtotal, 0),
    [items]
  );

  const igv = useMemo(() => calculateIGV(subtotal), [subtotal]);
  const total = useMemo(() => calculateTotal(subtotal), [subtotal]);
  const itemCount = items.length;

  const reset = useCallback(() => {
    setLines(new Map());
  }, []);

  return {
    lines,
    items,
    subtotal,
    igv,
    total,
    itemCount,
    setQuantity,
    removeLine,
    reset,
  };
}
