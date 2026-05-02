"use client";

import { useEffect, useRef, useState } from "react";
import { Truck, Factory, ClipboardCheck, PackageCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: Truck,
    title: "Recojo Inteligente",
    days: "Día 1-2",
    description: "Coordinamos recojo en su ubicación con nuestra flota.",
    number: 1,
  },
  {
    icon: Factory,
    title: "Lavado Industrial",
    days: "Día 3-18",
    description: "Procesamiento por lotes con protocolos certificados.",
    number: 2,
  },
  {
    icon: ClipboardCheck,
    title: "Control de Calidad",
    days: "Día 19-22",
    description: "Inspección exhaustiva pieza por pieza.",
    number: 3,
  },
  {
    icon: PackageCheck,
    title: "Entrega Puntual",
    days: "Día 23-25",
    description: "Empaquetado protegido. Entrega donde lo necesite.",
    number: 4,
  },
];

function StepItem({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={cn(
        "reveal relative flex items-start gap-6 lg:w-1/2",
        `stagger-${index + 1}`,
        isLeft ? "lg:mr-auto lg:pr-16 lg:text-right" : "lg:ml-auto lg:pl-16"
      )}
    >
      <div
        className={cn(
          "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-lg font-extrabold text-brand-blue shadow-lg ring-2 ring-brand-blue/30",
          inView && "animate-pulse-glow",
          !isLeft && "lg:order-last"
        )}
      >
        {step.number}
      </div>
      <div className={cn(!isLeft && "lg:text-left")}>
        <div className={cn("flex items-center gap-2", isLeft ? "lg:flex-row-reverse" : "")}>
          <step.icon className="h-5 w-5 text-brand-blue" />
          <h3 className="text-lg font-bold text-brand-blue">{step.title}</h3>
        </div>
        <span className="mt-1 inline-block rounded-full bg-brand-blue/10 px-3 py-0.5 text-xs font-semibold text-brand-blue">
          {step.days}
        </span>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export function LogisticsTimeline() {
  return (
    <section id="proceso" className="bg-white px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="section-title reveal">Proceso de 25 Días</h2>
          <p className="section-subtitle reveal stagger-1 mx-auto max-w-xl">
            Un ciclo completo de 25 días con trazabilidad en cada etapa.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-[23px] top-0 h-full w-0.5 lg:left-1/2 lg:-translate-x-px">
            <div className="h-full w-full bg-gradient-to-b from-brand-blue via-brand-blue/30 to-brand-red animate-pulse-glow" />
          </div>

          <div className="space-y-12">
            {STEPS.map((step, i) => (
              <StepItem key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
