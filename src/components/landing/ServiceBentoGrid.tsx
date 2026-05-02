import { ShieldCheck, Bed, Shirt } from "lucide-react";
import type { Service } from "@/types";
import { SERVICE_CATEGORY_LABELS } from "@/types";
import { formatCurrency } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, typeof ShieldCheck> = {
  frazada_1p: Bed,
  frazada_15p: Bed,
  edredon: Bed,
  ropa_industrial: Shirt,
  otro: ShieldCheck,
};

function ServiceCard({ service, large = false }: { service: Service; large?: boolean }) {
  const Icon = CATEGORY_ICONS[service.category] || ShieldCheck;

  return (
    <div
      className={`card group flex flex-col p-6 ${
        large ? "lg:col-span-2 lg:row-span-2" : ""
      }`}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-brand-blue/10 text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-brand-blue">{service.name}</h3>
      {large && service.long_desc && (
        <p className="mt-2 flex-1 text-sm text-gray-600">{service.long_desc}</p>
      )}
      {!large && service.description && (
        <p className="mt-2 flex-1 text-sm text-gray-600">{service.description}</p>
      )}
      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <span className="text-xs font-medium text-gray-500">
          {SERVICE_CATEGORY_LABELS[service.category]}
        </span>
        <span className="text-lg font-bold text-brand-red">
          {formatCurrency(service.base_price)}
        </span>
      </div>
    </div>
  );
}

export function ServiceBentoGrid({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return null;
  }

  const [highlight, ...rest] = services;

  return (
    <section id="servicios" className="bg-white px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="brand-divider-red mx-auto mb-4" />
          <h2 className="section-title">Nuestros Servicios</h2>
          <p className="section-subtitle mx-auto max-w-xl">
            Cada servicio sigue un protocolo espec&iacute;fico de lavado, secado y desinfecci&oacute;n.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlight && <ServiceCard service={highlight} large />}
          {rest.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
