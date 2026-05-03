import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const USERS = [
  { email: "admin@lavanderia.com", password: "admin12345", role: "superadmin", name: "Administrador", phone: null, company: null, ruc: null },
  { email: "cliente@lavanderia.com", password: "cliente12345", role: "client", name: "Cliente Demo", phone: "999888777", company: "Minera Demo S.A.", ruc: "20123456789" },
  { email: "chofer@lavanderia.com", password: "chofer12345", role: "employee", name: "Carlos Chofer", phone: "987111222", company: null, ruc: null },
];

async function main() {
  for (const u of USERS) {
    // 1. Eliminar si existe
    const { data: existing } = await supabase.from("profiles").select("id").eq("email", u.email).single();
    if (existing) {
      await supabase.from("profiles").delete().eq("id", existing.id);
      await supabase.auth.admin.deleteUser(existing.id);
      console.log(`🗑 Eliminado: ${u.email}`);
    }

    // 2. Crear en auth
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
    });

    if (authErr) {
      console.error(`❌ ${u.email}: ${authErr.message}`);
      continue;
    }

    const userId = authData.user!.id;
    console.log(`✅ Auth: ${u.email}`);

    // 3. Crear perfil
    const { error: profileErr } = await supabase.from("profiles").insert({
      id: userId,
      email: u.email,
      full_name: u.name,
      role: u.role,
      phone: u.phone || null,
      company_name: u.company || null,
      ruc: u.ruc || null,
    });

    if (profileErr) {
      console.error(`❌ Perfil ${u.email}: ${profileErr.message}`);
    } else {
      console.log(`   Perfil: ${u.role} - OK`);
    }

    // 4. Verificar login
    const testClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data: login, error: loginErr } = await testClient.auth.signInWithPassword({
      email: u.email,
      password: u.password,
    });
    if (loginErr) {
      console.log(`   ⚠️ Login test: ${loginErr.message}`);
    } else {
      console.log(`   🔑 Login test: OK (${login.user?.id.slice(0, 8)})`);
      await testClient.auth.signOut();
    }
  }

  console.log("\n✅ Listo. Prueba en: https://lavanderia-america.vercel.app/login");
}

main();
