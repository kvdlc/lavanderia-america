"use client";

import { useEffect, useRef, useState } from "react";
import { Award, Shirt, Building2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const STATS = [
  { target: 15, suffix: "+", title: "Años de Experiencia", icon: Award, color: "brand-blue" },
  { target: 50000, suffix: "+", title: "Prendas Procesadas", icon: Shirt, color: "brand-blue" },
  { target: 12, suffix: "+", title: "Empresas Aliadas", icon: Building2, color: "brand-blue" },
  { target: 99.8, suffix: "%", title: "Satisfacción", icon: Heart, color: "brand-blue" },
] as const;

function useCountUp(target: number, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const isFloat = target % 1 !== 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(isFloat ? Math.round(current * 10) / 10 : Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, inView]);
  return count;
}

function StatCard({
  stat,
  index,
}: {
  stat: (typeof STATS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const count = useCountUp(stat.target, inView);

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
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const display = stat.target % 1 !== 0 ? count.toFixed(1) : count.toLocaleString("es-PE");

  return (
    <div
      ref={ref}
      className={cn(
        "reveal card-premium flex flex-col items-center gap-3 p-8 text-center",
        `stagger-${index + 1}`
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/10">
        <stat.icon className="h-7 w-7 text-brand-blue" />
      </div>
      <span className="gradient-text-blue text-4xl font-extrabold">
        {display}
        {stat.suffix}
      </span>
      <span className="text-sm font-medium text-gray-500">{stat.title}</span>
    </div>
  );
}

export function StatsCounter() {
  return (
    <section className="relative bg-white bg-dots px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.title} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
