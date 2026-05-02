"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Servicios", href: "#servicios" },
  { label: "Cotizador", href: "#cotizador" },
  { label: "Proceso", href: "#proceso" },
  { label: "Confianza", href: "#confianza" },
  { label: "Tienda", href: "/tienda" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-nav">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-blue">
            <span className="text-lg font-extrabold text-white">LA</span>
          </div>
          <span className="hidden text-xl font-extrabold text-brand-blue sm:block">
            Lavander&iacute;a Am&eacute;rica
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-blue"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/login">
            <Button className="bg-brand-red hover:brightness-110">
              Acceso Clientes
            </Button>
          </Link>
        </div>

        <button
          className="lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-white px-4 pb-6 pt-2 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 text-sm font-medium text-gray-600"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3">
            <Link href="/login">
              <Button className="w-full bg-brand-red">Acceso Clientes</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
