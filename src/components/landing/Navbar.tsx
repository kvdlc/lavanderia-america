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
    <header className="fixed inset-x-0 top-0 z-50 glass border-b border-white/20 shadow-nav">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue shadow-md">
            <span className="text-lg font-extrabold text-white">LA</span>
          </div>
          <span className="hidden text-lg font-extrabold text-brand-blue sm:block">
            Lavander&iacute;a Am&eacute;rica
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-brand-blue after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:rounded-full after:bg-brand-blue after:transition-all after:duration-300 hover:after:left-0 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/admin"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-blue"
          >
            Admin
          </Link>
          <Link href="/login">
            <Button className="btn-primary rounded-xl px-5 py-2.5 text-sm">
              Acceso Clientes
            </Button>
          </Link>
        </div>

        <button
          className="rounded-lg p-2 transition-colors hover:bg-brand-blue/5 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Men&uacute;"
        >
          {open ? (
            <X className="h-6 w-6 text-brand-blue" />
          ) : (
            <Menu className="h-6 w-6 text-brand-blue" />
          )}
        </button>
      </div>

      {open && (
        <div className="glass-light animate-fade-in-up border-t border-gray-100 px-4 pb-6 pt-2 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 text-sm font-medium text-gray-600 transition-colors hover:text-brand-blue"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="block py-3 text-sm font-medium text-gray-600 transition-colors hover:text-brand-blue"
          >
            Admin
          </Link>
          <div className="mt-3">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button className="btn-primary w-full rounded-xl border-0 text-center">
                Acceso Clientes
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
