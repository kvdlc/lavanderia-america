"use client";

import { ShieldCheck, Clock, Users, Sparkles, BadgeCheck, TrendingUp } from "lucide-react";

const ADVANTAGES = [
  {
    icon: ShieldCheck,
    title: "Protocolos Certificados",
    description: "Estándares de sanitización validados para minería.",
  },
  {
    icon: TrendingUp,
    title: "Trazabilidad Total",
    description: "Seguimiento en tiempo real de cada lote procesado.",
  },
  {
    icon: Clock,
    title: "Entrega Puntual",
    description: "25 días garantizados con coordinación logística.",
  },
  {
    icon: Users,
    title: "Equipo Especializado",
    description: "Personal capacitado en manejo industrial de prendas.",
  },
  {
    icon: Sparkles,
    title: "Tecnología de Punta",
    description: "Maquinaria industrial de última generación.",
  },
  {
    icon: BadgeCheck,
    title: "Precios Transparentes",
    description: "Cotización al instante, IGV incluido, sin costos ocultos.",
  },
];

export function WhyUs() {
  return (
    <section className="bg-white bg-grid px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="glow-dot-red mr-3 inline-block" />
          <h2 className="section-title inline-block">
            ¿Por Qué Elegirnos?
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((item, i) => (
            <div
              key={item.title}
              className={`card-premium reveal stagger-${i + 1} flex flex-col items-center p-8 text-center`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue/10">
                <item.icon className="h-8 w-8 text-brand-blue" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
