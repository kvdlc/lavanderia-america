import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ServiceBentoGrid } from "@/components/landing/ServiceBentoGrid";
import { QuotationCalculator } from "@/components/landing/QuotationCalculator";
import { LogisticsTimeline } from "@/components/landing/LogisticsTimeline";
import { TrustedPartners } from "@/components/landing/TrustedPartners";
import { Footer } from "@/components/landing/Footer";
import { DEFAULT_SERVICES } from "@/data/pricing";
import type { Service } from "@/types";

export default async function HomePage() {
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
    // Use default services if Supabase is unavailable
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ServiceBentoGrid services={services} />
      <QuotationCalculator services={services} />
      <LogisticsTimeline />
      <TrustedPartners />
      <Footer />
    </main>
  );
}
