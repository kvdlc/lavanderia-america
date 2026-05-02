"use client";

;

const PARTNERS = [
  { name: "Minera Yanacocha" },
  { name: "Compañía Minera Antamina" },
  { name: "Sociedad Minera Cerro Verde" },
  { name: "Minera Las Bambas" },
  { name: "Buenaventura" },
  { name: "Southern Peru Copper" },
  { name: "Volcan" },
  { name: "Hochschild Mining" },
  { name: "Minsur" },
  { name: "Nexa Resources" },
];

function PartnerItem({ name }: { name: string }) {
  return (
    <div className="group flex shrink-0 flex-col items-center gap-3 px-6 w-40">
      <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-100 ring-2 ring-gray-100 transition-all duration-500 group-hover:ring-brand-blue/30 group-hover:scale-110">
        <img
          src="/images/partners/partner-placeholder.svg"
          alt={name}
          className="absolute inset-0 object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
        />
      </div>
      <span className="text-center text-xs font-medium text-gray-500 transition-colors group-hover:text-brand-blue">
        {name}
      </span>
    </div>
  );
}

export function TrustedPartners() {
  return (
    <section id="confianza" className="bg-slate-50 px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="section-title">Confían en Nosotros</h2>
          <p className="section-subtitle mx-auto max-w-xl">
            Las principales empresas mineras del Perú confían en nuestros servicios de lavandería industrial.
          </p>
        </div>

        <div className="mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            <div className="flex items-center gap-4 px-2">
              {PARTNERS.map((p) => (
                <PartnerItem key={p.name} name={p.name} />
              ))}
            </div>
            <div className="flex items-center gap-4 px-2" aria-hidden>
              {PARTNERS.map((p) => (
                <PartnerItem key={`dup-${p.name}`} name={p.name} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
