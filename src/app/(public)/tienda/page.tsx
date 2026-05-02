import { createClient } from "@/lib/supabase/server";
import { ServiceGrid } from "@/components/store/ServiceGrid";
import { CartDrawer } from "@/components/store/CartDrawer";
import { DEFAULT_SERVICES } from "@/data/pricing";
import type { Service } from "@/types";

export default async function TiendaPage() {
  let services: Service[] = DEFAULT_SERVICES as Service[];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true });

    if (data && data.length > 0) {
      services = data as Service[];
    }
  } catch {
    // Fallback to defaults
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-10">
        <div className="brand-divider-red mx-auto mb-4 lg:mx-0" />
        <h1 className="text-3xl font-extrabold text-brand-blue lg:text-4xl">
          Nuestros Servicios
        </h1>
        <p className="mt-2 text-gray-600">
          Seleccione los servicios que necesita y agr&eacute;guelos a su pedido.
        </p>
      </div>

      <ServiceGrid services={services} />
      <CartDrawer />
    </div>
  );
}
