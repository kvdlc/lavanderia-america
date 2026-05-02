"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import type { Service } from "@/types";

export function AddToCartButton({ service }: { service: Service }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem(service);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Button
      size="lg"
      onClick={handleClick}
      disabled={added}
      className={added ? "bg-green-600 hover:bg-green-600" : "bg-brand-red hover:brightness-110"}
    >
      {added ? (
        <>
          <Check className="mr-2 h-5 w-5" />
          Agregado
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Agregar al Pedido
        </>
      )}
    </Button>
  );
}
