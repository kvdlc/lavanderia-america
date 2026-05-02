"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "¿Cuánto tiempo toma el proceso completo?",
    answer:
      "Nuestro ciclo estándar es de 25 días: recojo (1-2 días), lavado industrial (3-18 días), control de calidad (19-22 días) y entrega (23-25 días).",
  },
  {
    question: "¿Qué tipo de prendas procesan?",
    answer:
      "Frazadas de 1 y 1.5 plazas, edredones con relleno de pluma o fibra sintética, y ropa industrial como overoles, uniformes y EPP.",
  },
  {
    question: "¿Cómo funciona el servicio con sucursales?",
    answer:
      "Las sucursales son negocios aliados que recolectan prendas en su zona. Nosotros recogemos, procesamos y devolvemos. La sucursal gana una comisión por cada pedido.",
  },
  {
    question: "¿Ofrecen servicio a domicilio?",
    answer:
      "Sí. Podemos recoger y entregar directamente en su domicilio, empresa o campamento. También puede recoger en nuestra planta principal.",
  },
  {
    question: "¿Cuáles son los métodos de pago?",
    answer:
      "Aceptamos transferencia bancaria, Yape, pago con tarjeta vía Izipay, y efectivo en punto de venta. Para empresas, manejamos facturación.",
  },
  {
    question: "¿Hay pedido mínimo?",
    answer:
      "No hay mínimo. Puede solicitar desde una prenda. Para pedidos corporativos grandes ofrecemos descuentos por volumen.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="section-title reveal">Preguntas Frecuentes</h2>
        </div>

        <div className="mt-12 space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`reveal stagger-${i + 1} rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-brand-blue shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-bold text-gray-900">
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-brand-blue" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm leading-relaxed text-gray-600 animate-fade-in-up">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
