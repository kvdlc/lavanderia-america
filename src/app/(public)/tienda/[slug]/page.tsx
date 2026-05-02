import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SERVICES } from "@/data/pricing";
import { SERVICE_CATEGORY_LABELS } from "@/types";
import { formatCurrency } from "@/lib/utils";
import type { Service } from "@/types";
import { AddToCartButton } from "./AddToCartButton";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let service: Service | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (data) service = data as Service;
  } catch {
    // Fallback
  }

  if (!service) {
    const fallback = (DEFAULT_SERVICES as Service[]).find((s) => s.slug === slug);
    if (fallback) service = fallback;
  }

  if (!service) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <nav className="mb-8 text-sm text-gray-500">
        <a href="/tienda" className="hover:text-brand-blue">
          Tienda
        </a>
        <span className="mx-2">/</span>
        <span>{service.name}</span>
      </nav>

      <div className="card p-8">
        <div className="brand-divider-red mb-6 w-16" />
        <h1 className="text-3xl font-extrabold text-brand-blue lg:text-4xl">
          {service.name}
        </h1>
        <span className="mt-3 inline-block rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
          {SERVICE_CATEGORY_LABELS[service.category]}
        </span>

        <p className="mt-6 text-lg leading-relaxed text-gray-600">
          {service.long_desc || service.description}
        </p>

        <div className="mt-8 flex items-center justify-between border-t pt-6">
          <div>
            <span className="text-sm text-gray-500">Precio unitario</span>
            <p className="text-3xl font-extrabold text-brand-red">
              {formatCurrency(service.base_price)}
            </p>
          </div>
          <AddToCartButton service={service} />
        </div>
      </div>
    </div>
  );
}
