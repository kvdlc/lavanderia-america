"use client";

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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3);
}

function PartnerItem({ name }: { name: string }) {
  return (
    <div className="group flex shrink-0 flex-col items-center gap-3 px-6 w-40">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-400 grayscale transition-all duration-500 group-hover:bg-brand-blue/10 group-hover:text-brand-blue group-hover:grayscale-0 group-hover:scale-110">
        {getInitials(name)}
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
