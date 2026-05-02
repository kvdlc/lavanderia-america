"use client";

import { useState, useRef } from "react";
import Link from "next/link";

import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ShieldCheck, Bed, Shirt, Sparkles, Check } from "lucide-react";
import type { Service, ServiceCategory } from "@/types";
import { SERVICE_CATEGORY_LABELS } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { CartDrawer } from "@/components/store/CartDrawer";

const CATEGORY_IMAGES: Record<ServiceCategory, string> = {
  frazada_1p: "/images/services/frazada-1p.svg",
  frazada_15p: "/images/services/frazada-15p.svg",
  edredon: "/images/services/edredon.svg",
  ropa_industrial: "/images/services/ropa-industrial.svg",
  otro: "/images/services/ropa-industrial.svg",
};

const CATEGORY_ICONS: Record<ServiceCategory, typeof ShieldCheck> = {
  frazada_1p: Bed,
  frazada_15p: Bed,
  edredon: Bed,
  ropa_industrial: Shirt,
  otro: Sparkles,
};

const FILTERS: { key: string | null; label: string }[] = [
  { key: null, label: "Todos" },
  { key: "frazada_1p", label: "Frazada 1p" },
  { key: "frazada_15p", label: "Frazada 1.5p" },
  { key: "edredon", label: "Edredón" },
  { key: "ropa_industrial", label: "Ropa Industrial" },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { addItem } = useCart();
  const Icon = CATEGORY_ICONS[service.category] || Sparkles;
  const imgSrc = CATEGORY_IMAGES[service.category];
  const cardRef = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const handleAdd = () => {
    addItem(service);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "card-premium card-glow group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg",
        "animate-fade-in-up opacity-0",
        `stagger-${Math.min((index % 5) + 1, 5)}`
      )}
      style={{ "--x": `${pos.x}%`, "--y": `${pos.y}%` } as React.CSSProperties}
    >
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={service.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-brand-blue shadow">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Badge variant="outline" className="mb-2 w-fit text-[10px]">
          {SERVICE_CATEGORY_LABELS[service.category]}
        </Badge>

        <Link href={`/tienda/${service.slug}`} className="group/link">
          <h3 className="text-base font-bold text-brand-blue transition-colors group-hover/link:text-brand-red">
            {service.name}
          </h3>
        </Link>
        <p className="mt-1 flex-1 text-sm text-gray-500 line-clamp-2">{service.description}</p>

        <div className="mt-4 flex items-center justify-between">
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
    </div>
  );
}

export function ServiceGrid({ services }: { services: Service[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const filtered = activeCategory ? services.filter((s) => s.category === activeCategory) : services;

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue via-brand-blue to-brand-red p-8 text-white lg:p-12">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-white/5" />
        <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">Nuestros Servicios</h2>
        <p className="mt-2 max-w-lg text-white/70">
          Selecciona una categoría y descubre nuestros servicios de lavandería industrial con estándares certificados.
        </p>
      </div>

      {/* Filter Pills */}
      <div className="mb-10 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key ?? "__all"}
            onClick={() => setActiveCategory(f.key)}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200",
              activeCategory === f.key
                ? "border-brand-blue bg-brand-blue/10 text-brand-blue shadow-sm"
                : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Sparkles className="mb-4 h-12 w-12 text-gray-300" />
          <p className="text-lg text-gray-400">No hay servicios disponibles en esta categoría.</p>
          <button
            onClick={() => setActiveCategory(null)}
            className="mt-4 text-sm font-medium text-brand-blue hover:underline"
          >
            Ver todos los servicios
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      )}

      <CartDrawer />
    </div>
  );
}
