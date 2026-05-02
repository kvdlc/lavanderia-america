import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-blue">
                <span className="text-lg font-extrabold text-white">LA</span>
              </div>
              <span className="text-xl font-extrabold text-white">
                Lavander&iacute;a Am&eacute;rica
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Limpieza industrial con los m&aacute;s altos est&aacute;ndares de calidad para el
              sector minero y corporativo.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Enlaces
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tienda" className="hover:text-white transition-colors">
                  Tienda
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Acceso Clientes
                </Link>
              </li>
              <li>
                <Link href="#servicios" className="hover:text-white transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="#cotizador" className="hover:text-white transition-colors">
                  Cotizador
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
                <span>Av. Principal 123, Planta Industrial, Per&uacute;</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>RUC: 20XXXXXXXXX</li>
              <li>Raz&oacute;n Social: Lavander&iacute;a Am&eacute;rica S.A.C.</li>
              <li>
                <Link href="/terminos" className="hover:text-white transition-colors">
                  T&eacute;rminos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-white transition-colors">
                  Pol&iacute;tica de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Lavander&iacute;a Am&eacute;rica. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
