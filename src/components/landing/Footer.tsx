import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-950 text-gray-300">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-blue to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/images/logo%20lavanderia%20para%20fondo%20oscuro.png"
                alt="Lavandería América"
                className="h-10 w-auto"
              />
              <span className="text-xl font-extrabold text-white">
                Lavandería América
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Limpieza industrial con los más altos estándares de calidad para el
              sector minero y corporativo.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Enlaces
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tienda" className="transition-colors hover:text-white">
                  Tienda
                </Link>
              </li>
              <li>
                <Link href="#servicios" className="transition-colors hover:text-white">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="#cotizador" className="transition-colors hover:text-white">
                  Cotizador
                </Link>
              </li>
              <li>
                <Link href="#proceso" className="transition-colors hover:text-white">
                  Proceso
                </Link>
              </li>
              <li>
                <Link href="#confianza" className="transition-colors hover:text-white">
                  Confianza
                </Link>
              </li>
              <li>
                <Link href="/admin" className="transition-colors hover:text-white">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-red" />
                <span>+51 999 999 999</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-red" />
                <span>contacto@lavanderiaamerica.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                <span>Av. Principal 123, Planta Industrial, Perú</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>RUC: 20XXXXXXXXX</li>
              <li>Razón Social: Lavandería América S.A.C.</li>
              <li>
                <Link href="/terminos" className="transition-colors hover:text-white">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="transition-colors hover:text-white">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>
            &copy; {year} Lavandería América. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
