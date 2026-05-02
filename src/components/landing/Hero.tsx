"use client";

import Link from "next/link";
import { Check, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white bg-grid px-4 pt-20">
      {/* Floating geometric shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[5%] top-[10%] h-24 w-24 animate-float rounded-full bg-brand-blue/5" style={{ animationDelay: "0s" }} />
        <div className="absolute right-[8%] top-[18%] h-16 w-16 animate-float-slow rotate-45 rounded-xl bg-brand-red/5" style={{ animationDelay: "1.5s" }} />
        <div className="absolute left-[12%] top-[45%] h-14 w-14 animate-float rounded-full bg-brand-blue/[0.06]" style={{ animationDelay: "2.5s" }} />
        <div className="absolute bottom-[20%] right-[10%] h-28 w-28 animate-float-slow rotate-12 rounded-2xl bg-brand-red/5" style={{ animationDelay: "0.8s" }} />
        <div className="absolute bottom-[35%] left-[5%] h-16 w-16 animate-float rotate-45 bg-brand-blue/5" style={{ animationDelay: "3.5s" }} />
        <div className="absolute right-[6%] top-[60%] h-10 w-10 animate-float-slow rounded-full bg-brand-red/[0.07]" style={{ animationDelay: "2s" }} />
        <div className="absolute left-[42%] top-[14%] h-12 w-12 animate-float rounded-full bg-brand-blue/[0.04]" style={{ animationDelay: "4s" }} />
        <div className="absolute bottom-[12%] right-[28%] h-20 w-20 animate-float-slow rotate-45 rounded-2xl bg-brand-blue/5" style={{ animationDelay: "3s" }} />
      </div>

      {/* Decorative stars */}
      <span className="pointer-events-none absolute left-[18%] top-[22%] animate-float text-xl text-brand-blue/20" style={{ animationDelay: "0.5s" }}>&#10022;</span>
      <span className="pointer-events-none absolute right-[20%] top-[55%] animate-float-slow text-2xl text-brand-red/20" style={{ animationDelay: "1s" }}>&#10025;</span>
      <span className="pointer-events-none absolute bottom-[30%] left-[28%] animate-float text-lg text-brand-blue/15" style={{ animationDelay: "2s" }}>&#10022;</span>
      <span className="pointer-events-none absolute right-[32%] top-[35%] animate-float-slow text-xl text-brand-red/15" style={{ animationDelay: "3s" }}>&#10025;</span>
      <span className="pointer-events-none absolute bottom-[18%] left-[55%] animate-float text-base text-brand-blue/15" style={{ animationDelay: "5s" }}>&#10022;</span>

      {/* Content */}
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
        {/* Left: Text */}
        <div className="text-center lg:text-left">
          <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-brand-blue/10 bg-brand-blue/10 px-5 py-1.5 text-sm font-medium text-brand-blue">
            &#129530; Servicio Industrial Certificado
          </div>

          <h1 className="gradient-text-blue stagger-1 mt-6 text-5xl font-extrabold leading-tight tracking-tight lg:text-7xl animate-fade-in-up">
            Limpieza con Est&aacute;ndares de Acero
          </h1>

          <p className="stagger-2 mx-auto mt-6 max-w-2xl text-lg text-gray-600 lg:mx-0 lg:text-xl animate-fade-in-up">
            Procesamiento industrial de prendas para el sector minero y corporativo. Protocolos certificados, trazabilidad completa y entrega puntual en toda la regi&oacute;n.
          </p>

          <div className="stagger-3 mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start animate-fade-in-up">
            <Link href="#cotizador" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg">
              Quiero mi Cotizaci&oacute;n
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/tienda" className="btn-ghost-brand inline-flex items-center gap-2 px-8 py-4 text-lg">
              Ver Servicios
              <Star className="h-5 w-5" />
            </Link>
          </div>

          <div className="stagger-4 mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 lg:justify-start animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-brand-blue" />
              Sin compromiso
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-brand-blue" />
              Respuesta en 24h
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-brand-blue" />
              IGV incluido
            </span>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div className="relative hidden lg:flex lg:items-center lg:justify-center">
          <div className="animate-float-slow relative w-full max-w-[400px]">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-blue/10 via-brand-red/5 to-brand-blue/5 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="/images/imagen%20de%20lavadora.png"
                alt="Lavandería Industrial"
                className="relative z-10 w-full"
              />
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-brand-blue/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
