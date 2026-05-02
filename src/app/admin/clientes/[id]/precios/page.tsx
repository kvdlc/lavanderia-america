"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { SERVICE_CATEGORY_LABELS } from "@/types";
import type { Service, Profile, ClientPricing, ServiceCategory } from "@/types";

export default function ClientePreciosPage() {
  const params = useParams();
  const clientId = params.id as string;
  const [client, setClient] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [pricing, setPricing] = useState<Record<string, string>>({});
  const [savedPricing, setSavedPricing] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("profiles").select("*").eq("id", clientId).single(),
      supabase.from("services").select("*").eq("active", true).order("display_order"),
      supabase.from("client_pricing").select("*").eq("client_id", clientId),
    ]).then(([clientRes, servicesRes, pricingRes]) => {
      if (clientRes.error) setError(clientRes.error.message);
      else setClient(clientRes.data);

      if (servicesRes.data) setServices(servicesRes.data);

      const priceMap: Record<string, string> = {};
      if (pricingRes.data) {
        pricingRes.data.forEach((p: ClientPricing) => {
          priceMap[p.service_id] = String(p.custom_price);
        });
      }
      setPricing(priceMap);
      setSavedPricing({ ...priceMap });
      setLoading(false);
    });
  }, [clientId]);

  const hasChanges = () => {
    for (const sid of Object.keys(pricing)) {
      if (pricing[sid] !== (savedPricing[sid] || "")) return true;
    }
    for (const sid of Object.keys(savedPricing)) {
      if (!(sid in pricing)) return true;
    }
    return false;
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const upserts: { client_id: string; service_id: string; custom_price: number }[] = [];
    for (const [serviceId, price] of Object.entries(pricing)) {
      if (price && Number(price) >= 0) {
        upserts.push({ client_id: clientId, service_id: serviceId, custom_price: Number(price) });
      }
    }

    const supabase = createClient();
    if (upserts.length > 0) {
      const { error: err } = await supabase.from("client_pricing").upsert(upserts, { onConflict: "client_id,service_id" });
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
    }

    setSavedPricing({ ...pricing });
    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error && !client) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-600">Error: {error}</p>
        <Link href="/admin/clientes"><Button variant="outline">Volver a Clientes</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/admin/clientes" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue">
        <ArrowLeft className="h-4 w-4" />
        Volver a Clientes
      </Link>
      <div>
        <h2 className="text-2xl font-bold text-brand-blue">Precios Personalizados</h2>
        <p className="text-sm text-gray-500">{client?.full_name} — {client?.email}</p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}
      {success && (
        <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm">Precios guardados correctamente</div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Servicios</CardTitle>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay servicios registrados</p>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Precio Base</TableHead>
                    <TableHead className="text-right">Precio Personalizado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-sm text-gray-500">{SERVICE_CATEGORY_LABELS[s.category as ServiceCategory] || s.category}</TableCell>
                      <TableCell className="text-right">{formatCurrency(s.base_price)}</TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-28 ml-auto text-right"
                          value={pricing[s.id] || ""}
                          onChange={(e) => setPricing({ ...pricing, [s.id]: e.target.value })}
                          placeholder={formatCurrency(s.base_price)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button onClick={handleSave} disabled={saving || !hasChanges()} className="bg-brand-blue hover:bg-brand-blue/90">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar Precios
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
