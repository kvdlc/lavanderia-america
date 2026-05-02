"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/auth/actions";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Store,
  Banknote, ShoppingBasket, Megaphone, Truck, MapPin,
  UserCog, Settings, LogOut, Menu, X, Home,
} from "lucide-react";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Servicios", href: "/admin/servicios", icon: Package },
  { label: "Pedidos", href: "/admin/pedidos", icon: ShoppingCart },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
  { label: "Sucursales", href: "/admin/sucursales", icon: Store },
  { label: "Caja Chica", href: "/admin/caja", icon: Banknote },
  { label: "Punto de Venta", href: "/admin/pos", icon: ShoppingBasket },
  { label: "Promociones", href: "/admin/promociones", icon: Megaphone },
  { label: "Movilidad", href: "/admin/movilidad", icon: Truck },
  { label: "Entregas", href: "/admin/entregas", icon: MapPin },
  { label: "Empleados", href: "/admin/empleados", icon: UserCog },
  { label: "Configuracion", href: "/admin/configuracion", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className={cn("fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto bg-white shadow-md transition-transform lg:static lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-brand-blue">
            <span className="text-sm font-extrabold text-white">LA</span>
          </div>
          <span className="text-lg font-bold text-brand-blue">Admin</span>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {ADMIN_NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                  ? "bg-brand-blue/10 text-brand-blue" : "text-gray-600 hover:bg-gray-100")}>
              <item.icon className="h-4 w-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t p-3">
          <Link href="/" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-500 hover:text-brand-blue"><Home className="h-4 w-4" />Ver Sitio</Link>
          <form action={() => logoutAction()}>
            <Button type="submit" variant="ghost" className="w-full justify-start text-gray-500 hover:text-red-600"><LogOut className="mr-2 h-4 w-4" />Salir</Button>
          </form>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(!open)}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          <h1 className="text-lg font-bold text-brand-blue">Panel Administrativo</h1>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
