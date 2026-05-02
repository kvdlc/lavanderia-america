import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 lg:py-32">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="mx-auto max-w-7xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-brand-blue"
              style={{
                fontSize: `${Math.random() * 60 + 40}px`,
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 90}%`,
              }}
            >
              &#9733;
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl text-center">
        <div className="brand-divider-red mx-auto mb-6" />
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-brand-blue lg:text-6xl">
          Limpieza con Est&aacute;ndares de Acero
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 lg:text-xl">
          Procesamiento industrial de prendas para el sector minero y corporativo.
          Protocolos certificados, trazabilidad completa y entrega puntual en toda la regi&oacute;n.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="#cotizador">
            <Button size="lg" className="bg-brand-red px-8 py-6 text-lg hover:brightness-110">
              Quiero mi Cotizaci&oacute;n
            </Button>
          </Link>
          <Link href="/tienda">
            <Button
              variant="outline"
              size="lg"
              className="border-brand-blue px-8 py-6 text-lg text-brand-blue hover:bg-brand-blue hover:text-white"
            >
              Ver Servicios
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
