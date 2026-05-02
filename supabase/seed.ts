import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://alzywotjziwapyiisuid.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!serviceRoleKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY no definido en .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seed() {
  console.log("Seeding database...\n");

  // ── 1. PERMISSIONS ──
  const permissions = [
    "admin:dashboard", "admin:services", "admin:orders", "admin:clients",
    "admin:branches", "admin:caja", "admin:pos", "admin:promotions",
    "admin:vehicles", "admin:deliveries", "admin:settlements", "admin:employees",
    "admin:config", "admin:reports", "admin:client_pricing",
  ];

  const { data: existingPerms } = await supabase.from("permissions").select("slug");
  const existingSlugs = new Set((existingPerms || []).map((p: any) => p.slug));
  const newPerms = permissions.filter((s) => !existingSlugs.has(s));

  if (newPerms.length > 0) {
    const { error: permError } = await supabase.from("permissions").insert(
      newPerms.map((slug) => ({ slug, description: `Permiso ${slug}` }))
    );
    if (permError) console.error("Permissions error:", permError.message);
    else console.log(`✓ ${newPerms.length} permissions created`);
  } else {
    console.log("✓ Permissions already exist");
  }

  // ── 2. SERVICES ──
  const services = [
    { name: "Lavado de Frazada 1 Plaza", slug: "lavado-frazada-1-plaza", description: "Lavado industrial profundo con desinfección.", long_desc: "Proceso de lavado industrial que garantiza eliminación completa de bacterias, ácaros y suciedad. Detergentes hipoalergénicos de grado industrial.", base_price: 15.00, category: "frazada_1p", active: true, display_order: 1 },
    { name: "Lavado de Frazada 1.5 Plazas", slug: "lavado-frazada-1-5-plazas", description: "Lavado industrial para frazadas de 1.5 plazas.", long_desc: "Tratamiento con doble enjuague y secado completo para máxima frescura e higiene.", base_price: 20.00, category: "frazada_15p", active: true, display_order: 2 },
    { name: "Lavado de Edredón", slug: "lavado-edredon", description: "Lavado especializado para edredones con relleno de pluma o fibra sintética.", long_desc: "Lavado suave pero efectivo. Secado en condiciones controladas para mantener volumen y calidad.", base_price: 25.00, category: "edredon", active: true, display_order: 3 },
    { name: "Lavado de Ropa Industrial", slug: "lavado-ropa-industrial", description: "Lavado de overoles, uniformes y ropa de trabajo con protocolos certificados.", long_desc: "Grandes volúmenes con altos estándares. Protocolos de sanitización certificados para minería y corporativo. Trazabilidad por lote.", base_price: 12.00, category: "ropa_industrial", active: true, display_order: 4 },
  ];

  for (const s of services) {
    const { data: existing } = await supabase.from("services").select("id").eq("slug", s.slug).single();
    if (!existing) {
      await supabase.from("services").insert(s);
    }
  }
  console.log("✓ Services seeded (4)");

  // ── 3. BRANCH (Sucursal de prueba) ──
  const { data: existingBranch } = await supabase.from("branches").select("id").eq("name", "Sastrería El Rápido").single();
  if (!existingBranch) {
    const { error: branchErr } = await supabase.from("branches").insert({
      name: "Sastrería El Rápido",
      address: "Jr. Comercio 456, Local 3, Centro",
      phone: "987654321",
      contact_person: "Don Pedro Martínez",
      commission_percent: 12.5,
      billing_cycle: "semanal",
      active: true,
      notes: "Sucursal externa de recojo. Recoge prendas de la zona centro.",
    });
    if (branchErr) console.error("Branch error:", branchErr.message);
    else console.log("✓ Branch 'Sastrería El Rápido' created");
  } else {
    console.log("✓ Branch already exists");
  }

  // ── 4. VEHICLE ──
  const { data: existingVehicle } = await supabase.from("vehicles").select("id").eq("plate", "ABC-123").single();
  if (!existingVehicle) {
    const { error: vErr } = await supabase.from("vehicles").insert({
      plate: "ABC-123",
      name: "Camioneta Toyota Blanca",
      type: "ambos",
      driver_name: "Carlos López",
      driver_phone: "987111222",
      active: true,
    });
    if (vErr) console.error("Vehicle error:", vErr.message);
    else console.log("✓ Vehicle 'ABC-123' created");
  } else {
    console.log("✓ Vehicle already exists");
  }

  console.log("\n✅ Seed complete!");
  console.log("\n📋 Next steps:");
  console.log("   1. Create an admin user via Supabase dashboard (Auth > Users > Add User)");
  console.log("   2. Then insert into profiles: INSERT INTO profiles (id, email, full_name, role) VALUES ('<user_id>', '<email>', 'Admin', 'superadmin');");
  console.log("   3. Go to the app and login at /login");
  console.log("   4. Register a test client at /registro\n");
}

seed();
