"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-blue via-brand-blue to-brand-red px-4 py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />

      <span className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 animate-float rounded-full bg-brand-red/10" />
      <span className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 animate-float-slow rounded-full bg-white/5" />
      <span className="pointer-events-none absolute right-[10%] top-[30%] h-32 w-32 animate-pulse-glow rounded-full bg-brand-blue/20" />

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold text-white lg:text-5xl">
          ¿Listo para la mejor limpieza industrial?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
          Solicite su cotización sin compromiso y descubra por qué las principales
          empresas confían en nosotros.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="#cotizador"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-brand-blue transition-all duration-300 hover:bg-gray-100"
          >
            Solicitar Cotización
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-white px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-white/10"
          >
            Contactar
          </Link>
        </div>
      </div>
    </section>
  );
}
