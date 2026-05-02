"use client";

import { useState, useRef, type MouseEvent } from "react";
import { Bed, Shirt, Sparkles } from "lucide-react";
import type { Service } from "@/types";
import { SERVICE_CATEGORY_LABELS } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, typeof Bed> = {
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "card-premium card-glow group flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
        large ? "lg:col-span-2 lg:row-span-2" : ""
      )}
      style={
        {
          "--glow-x": `${glowPos.x}%`,
          "--glow-y": `${glowPos.y}%`,
        } as React.CSSProperties
      }
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-brand-blue/10 text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
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
