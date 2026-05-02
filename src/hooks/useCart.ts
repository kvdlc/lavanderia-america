import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Service } from "@/types";
import { calculateIGV, calculateTotal } from "@/lib/pricing";

export interface CartItem {
  service: Service;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (service: Service, quantity?: number) => void;
  removeItem: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: () => number;
  igv: () => number;
  total: () => number;
  itemCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (service, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.service.id === service.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.service.id === service.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { service, quantity }] };
        });
      },

      removeItem: (serviceId) => {
        set((state) => ({
          items: state.items.filter((i) => i.service.id !== serviceId),
        }));
      },

      updateQuantity: (serviceId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(serviceId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.service.id === serviceId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      subtotal: () => {
        return get().items.reduce((acc, i) => acc + i.service.base_price * i.quantity, 0);
      },

      igv: () => calculateIGV(get().subtotal()),

      total: () => calculateTotal(get().subtotal()),

      itemCount: () => {
        return get().items.reduce((acc, i) => acc + i.quantity, 0);
      },
    }),
    { name: "lavanderia-cart" }
  )
);
