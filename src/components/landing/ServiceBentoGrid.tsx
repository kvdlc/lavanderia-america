"use client";

import { useState, useRef, type MouseEvent } from "react";

import { Bed, Shirt, Sparkles } from "lucide-react";
import type { Service, ServiceCategory } from "@/types";
import { SERVICE_CATEGORY_LABELS } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";

const CATEGORY_IMAGES: Record<ServiceCategory, string> = {
  frazada_1p: "/images/services/frazada-1p.svg",
  frazada_15p: "/images/services/frazada-15p.svg",
  edredon: "/images/services/edredon.svg",
  ropa_industrial: "/images/services/ropa-industrial.svg",
  otro: "/images/services/ropa-industrial.svg",
};

const CATEGORY_ICONS: Record<ServiceCategory, typeof Bed> = {
  frazada_1p: Bed,
  frazada_15p: Bed,
  edredon: Bed,
  ropa_industrial: Shirt,
  otro: Sparkles,
};

function ServiceCard({
  service,
  large = false,
}: {
  service: Service;
  large?: boolean;
}) {
  const Icon = CATEGORY_ICONS[service.category] || Sparkles;
  const imgSrc = CATEGORY_IMAGES[service.category];
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "card-premium card-glow group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
        large ? "lg:col-span-2 lg:row-span-2" : ""
      )}
      style={{ "--x": `${pos.x}%`, "--y": `${pos.y}%` } as React.CSSProperties}
    >
      <div className={cn("relative w-full overflow-hidden", large ? "h-48" : "h-[120px]")}>
        <img
          src={imgSrc}
          alt={service.name}
          className="absolute inset-0 rounded-t-2xl object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-t from-black/25 to-transparent" />
        <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 text-brand-blue shadow backdrop-blur-sm">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-brand-blue">{service.name}</h3>
        {large && service.long_desc && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
            {service.long_desc}
          </p>
        )}
        {!large && service.description && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
            {service.description}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="rounded-full bg-brand-blue/10 px-3 py-0.5 text-xs font-semibold text-brand-blue">
            {SERVICE_CATEGORY_LABELS[service.category]}
          </span>
          <span className="text-xl font-bold text-brand-red">
            {formatCurrency(service.base_price)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ServiceBentoGrid({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  const [highlight, ...rest] = services;

  return (
    <section id="servicios" className="bg-white px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="section-title reveal">Nuestros Servicios</h2>
          <p className="section-subtitle reveal stagger-1 mx-auto max-w-2xl">
            Cada servicio sigue un protocolo específico de lavado, secado y desinfección con trazabilidad completa.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlight && (
            <div className="reveal stagger-2 sm:col-span-2 lg:col-span-2 lg:row-span-2">
              <ServiceCard service={highlight} large />
            </div>
          )}
          {rest.map((s, i) => (
            <div key={s.id} className={cn("reveal", `stagger-${Math.min(i + 3, 5)}`)}>
              <ServiceCard service={s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
