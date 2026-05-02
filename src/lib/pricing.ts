import type { Service, ClientPricing, Promotion } from "@/types";

const IGV_RATE = 0.18;

interface VolumeTier {
  minQty: number;
  discountPercent: number;
}

const VOLUME_TIERS: VolumeTier[] = [
  { minQty: 1, discountPercent: 0 },
  { minQty: 20, discountPercent: 5 },
  { minQty: 50, discountPercent: 10 },
  { minQty: 100, discountPercent: 15 },
];

export function getUnitPrice(
  service: Service,
  quantity: number,
  clientPricing?: ClientPricing | null,
  activePromotion?: Promotion | null
): { unitPrice: number; basePrice: number; discount: number } {
  let price = clientPricing?.custom_price ?? service.base_price;

  let discount = 0;

  if (activePromotion) {
    const promoDiscount = (price * activePromotion.discount_percent) / 100;
    discount += promoDiscount;
    price -= promoDiscount;
  }

  const tier = [...VOLUME_TIERS].reverse().find((t) => quantity >= t.minQty);
  if (tier && tier.discountPercent > 0) {
    const volumeDiscount = (price * tier.discountPercent) / 100;
    discount += volumeDiscount;
    price -= volumeDiscount;
  }

  return {
    unitPrice: Number(price.toFixed(2)),
    basePrice: service.base_price,
    discount: Number(discount.toFixed(2)),
  };
}

export function calculateItemSubtotal(unitPrice: number, quantity: number): number {
  return Number((unitPrice * quantity).toFixed(2));
}

export function calculateSubtotal(items: { unitPrice: number; quantity: number }[]): number {
  return Number(items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0).toFixed(2));
}

export function calculateIGV(subtotal: number): number {
  return Number((subtotal * IGV_RATE).toFixed(2));
}

export function calculateTotal(subtotal: number): number {
  return Number((subtotal + calculateIGV(subtotal)).toFixed(2));
}

export interface QuotationLineItem {
  service: Service;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount: number;
}

export interface QuotationResult {
  items: QuotationLineItem[];
  subtotal: number;
  totalDiscount: number;
  igv: number;
  total: number;
}

export function calculateQuotation(
  services: Service[],
  quantities: Record<string, number>,
  clientPricing?: ClientPricing[] | null,
  activePromotion?: Promotion | null
): QuotationResult {
  const items: QuotationLineItem[] = [];
  let totalDiscount = 0;

  for (const service of services) {
    const qty = quantities[service.id] || 0;
    if (qty <= 0) continue;

    const cp = clientPricing?.find((p) => p.service_id === service.id);
    const { unitPrice, discount } = getUnitPrice(service, qty, cp, activePromotion);
    const subtotal = calculateItemSubtotal(unitPrice, qty);

    items.push({ service, quantity: qty, unitPrice, subtotal, discount: discount * qty });
    totalDiscount += discount * qty;
  }

  const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
  const igv = calculateIGV(subtotal);
  const total = Number((subtotal + igv).toFixed(2));

  return {
    items,
    subtotal: Number(subtotal.toFixed(2)),
    totalDiscount: Number(totalDiscount.toFixed(2)),
    igv,
    total,
  };
}
