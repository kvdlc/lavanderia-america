import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, source, branch_id, payment_method, delivery_destination, delivery_address, delivery_branch_id, notes, walk_in_name, walk_in_phone } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Debe incluir al menos un servicio" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const adminClient = createAdminClient();

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const { data: service } = await adminClient
        .from("services")
        .select("base_price, active")
        .eq("id", item.service_id)
        .single();

      if (!service || !service.active) {
        return NextResponse.json(
          { error: `Servicio ${item.service_id} no disponible` },
          { status: 400 }
        );
      }

      const unitPrice = service.base_price;
      const itemSubtotal = unitPrice * (item.quantity || 1);
      subtotal += itemSubtotal;

      orderItems.push({
        service_id: item.service_id,
        quantity: item.quantity || 1,
        unit_price: unitPrice,
        subtotal: itemSubtotal,
      });
    }

    const igv = Number((subtotal * 0.18).toFixed(2));
    const total = Number((subtotal + igv).toFixed(2));

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 25);

    const { data: order, error: orderError } = await adminClient
      .from("orders")
      .insert({
        client_id: user?.id || null,
        branch_id: branch_id || null,
        source: source || "web",
        status: "cotizacion",
        subtotal,
        igv,
        total,
        payment_method: payment_method || "pendiente",
        payment_status: "pendiente",
        delivery_destination: delivery_destination || "planta",
        delivery_address: delivery_address || null,
        delivery_branch_id: delivery_branch_id || null,
        estimated_delivery: estimatedDate.toISOString().split("T")[0],
        walk_in_name: walk_in_name || null,
        walk_in_phone: walk_in_phone || null,
        notes: notes || null,
        created_by: user?.id || null,
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    const itemsWithOrderId = orderItems.map((i) => ({
      ...i,
      order_id: order.id,
    }));

    const { error: itemsError } = await adminClient.from("order_items").insert(itemsWithOrderId);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    await adminClient.from("order_status_log").insert({
      order_id: order.id,
      status: "cotizacion",
      note: "Pedido creado",
      created_by: user?.id || null,
    });

    return NextResponse.json({ data: order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const adminClient = createAdminClient();

    let query = adminClient.from("orders").select("*, order_items(*, service:services(*)), order_status_log!order_status_log_order_id_fkey(*)").order("created_at", { ascending: false });

    if (!profile || profile.role === "client") {
      query = query.eq("client_id", user.id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
