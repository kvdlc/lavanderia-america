import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const adminClient = createAdminClient();
    const { data: order, error } = await adminClient
      .from("orders")
      .select("*, order_items(*, service:services(*)), order_status_log!order_status_log_order_id_fkey(*)")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    if (profile?.role === "client" && order.client_id !== user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    return NextResponse.json({ data: order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role === "client") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { status, note } = await request.json();

    const adminClient = createAdminClient();

    const { error: updateError } = await adminClient
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
        ...(status === "entregado" ? { actual_delivery: new Date().toISOString(), payment_status: "pagado" } : {}),
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const { error: logError } = await adminClient.from("order_status_log").insert({
      order_id: id,
      status,
      note: note || null,
      created_by: user.id,
    });

    if (logError) {
      return NextResponse.json({ error: logError.message }, { status: 500 });
    }

    if (status === "entregado") {
      await adminClient.from("transactions").insert({
        type: "ingreso",
        category: "venta",
        amount: 0,
        payment_method: "efectivo",
        reference_type: "order",
        reference_id: id,
        description: "Pago automático al entregar",
        created_by: user.id,
      });
    }

    return NextResponse.json({ data: { id, status } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
