import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, Users, Banknote } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

async function getStats() {
  const adminClient = createAdminClient();

  const [{ count: pedidosCount }, { count: serviciosCount }, { count: clientesCount }, { data: ingresos }] =
    await Promise.all([
      adminClient.from("orders").select("*", { count: "exact", head: true }),
      adminClient.from("services").select("*", { count: "exact", head: true }).eq("active", true),
      adminClient.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client"),
      adminClient.from("transactions").select("amount").eq("type", "ingreso"),
    ]);

  const totalIngresos = (ingresos || []).reduce((sum, t) => sum + Number(t.amount), 0);

  return { pedidosCount, serviciosCount, clientesCount, totalIngresos };
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="flex items-center justify-center h-64"><p className="text-gray-500">No autorizado</p></div>;
  }

  const { pedidosCount, serviciosCount, clientesCount, totalIngresos } = await getStats();

  const cards = [
    { title: "Pedidos", value: pedidosCount ?? 0, icon: ShoppingCart, color: "text-brand-blue" },
    { title: "Servicios", value: serviciosCount ?? 0, icon: Package, color: "text-green-600" },
    { title: "Clientes", value: clientesCount ?? 0, icon: Users, color: "text-purple-600" },
    { title: "Ingresos", value: formatCurrency(totalIngresos), icon: Banknote, color: "text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand-blue">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
