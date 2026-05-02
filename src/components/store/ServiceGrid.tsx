"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ShieldCheck, Bed, Shirt } from "lucide-react";
import type { Service } from "@/types";
import { SERVICE_CATEGORY_LABELS } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, typeof ShieldCheck> = {
  frazada_1p: Bed,
  frazada_15p: Bed,
  edredon: Bed,
  ropa_industrial: Shirt,
  otro: ShieldCheck,
};

function ServiceCard({ service }: { service: Service }) {
  const { addItem } = useCart();
  const Icon = CATEGORY_ICONS[service.category] || ShieldCheck;
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(service);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="card flex flex-col p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-blue/10 text-brand-blue">
          <Icon className="h-5 w-5" />
        </div>
        <Badge variant="outline" className="text-xs">
          {SERVICE_CATEGORY_LABELS[service.category]}
        </Badge>
      </div>

      <Link href={`/tienda/${service.slug}`} className="group">
        <h3 className="text-base font-bold text-brand-blue group-hover:underline">
          {service.name}
        </h3>
      </Link>
      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{service.description}</p>

      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="text-lg font-bold text-brand-red">
          {formatCurrency(service.base_price)}
        </span>
        <Button
          size="sm"
          variant={added ? "outline" : "default"}
          className={cn(
            "transition-all",
            added
              ? "border-green-500 text-green-600"
              : "bg-brand-red hover:brightness-110"
          )}
          onClick={handleAdd}
        >
          <ShoppingCart className="mr-1 h-4 w-4" />
          {added ? "Agregado" : "Agregar"}
        </Button>
      </div>
    </div>
  );
}

export function ServiceGrid({ services }: { services: Service[] }) {
  const categories = [...new Set(services.map((s) => s.category))];
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? services.filter((s) => s.category === activeCategory)
    : services;

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        <Badge
          variant={activeCategory === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setActiveCategory(null)}
        >
          Todos
        </Badge>
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveCategory(cat)}
          >
            {SERVICE_CATEGORY_LABELS[cat]}
          </Badge>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-gray-500">No hay servicios disponibles.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
