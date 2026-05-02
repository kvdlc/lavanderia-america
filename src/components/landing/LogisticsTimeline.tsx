import { Truck, Factory, ClipboardCheck, PackageCheck } from "lucide-react";

const STEPS = [
  {
    icon: Truck,
    title: "Recojo",
    days: "Día 1-2",
    description: "Nuestra movilidad recoge las prendas en su empresa, sucursal o campamento.",
  },
  {
    icon: Factory,
    title: "Lavado Industrial",
    days: "Día 3-18",
    description: "Procesamiento por lotes con protocolos certificados de lavado, secado y desinfección.",
  },
  {
    icon: ClipboardCheck,
    title: "Control de Calidad",
    days: "Día 19-22",
    description: "Inspección pieza por pieza. Verificación de manchas, integridad del tejido y sanitización.",
  },
  {
    icon: PackageCheck,
    title: "Entrega",
    days: "Día 23-25",
    description: "Empaquetado protegido y entrega en su destino: planta, domicilio o sucursal.",
  },
];

export function LogisticsTimeline() {
  return (
    <section id="proceso" className="bg-white px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="brand-divider-red mx-auto mb-4" />
          <h2 className="section-title">Nuestro Proceso</h2>
          <p className="section-subtitle mx-auto max-w-xl">
            Un ciclo completo de 25 días con trazabilidad en cada etapa.
          </p>
        </div>

        <div className="mt-16 relative">
          <div className="absolute left-[19px] top-0 h-full w-0.5 bg-brand-blue/20 lg:left-1/2 lg:-translate-x-px" />

          <div className="space-y-12">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className={`relative flex items-start gap-6 lg:w-1/2 ${
                  i % 2 === 0 ? "lg:ml-auto lg:pl-12" : "lg:mr-auto lg:pr-12 lg:text-right"
                }`}
              >
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-white ${
                    i === 0
                      ? "border-brand-blue bg-brand-blue"
                      : i === STEPS.length - 1
                        ? "border-brand-red bg-brand-red"
                        : "border-brand-blue/30 bg-white text-brand-blue"
                  } ${i % 2 === 1 ? "lg:order-last" : ""}`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <div className={i % 2 === 1 ? "lg:text-right" : ""}>
                  <div className="brand-divider-blue mb-2 w-12 lg:w-16" />
                  <h3 className="text-lg font-bold text-brand-blue">{step.title}</h3>
                  <span className="mt-1 inline-block rounded-full bg-brand-blue/10 px-3 py-0.5 text-xs font-semibold text-brand-blue">
                    {step.days}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
