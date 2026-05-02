"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "@/lib/validations";

async function createAuthClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]
        ) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

export async function loginAction(formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Email o contraseña inválidos." };
  }

  const supabase = await createAuthClient();

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Credenciales incorrectas." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .single();

  if (profile?.role === "client") {
    redirect("/cliente");
  }
  redirect("/admin");
}

export async function registerAction(formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    full_name: formData.get("full_name") as string,
    phone: (formData.get("phone") as string) || undefined,
    company_name: (formData.get("company_name") as string) || undefined,
    ruc: (formData.get("ruc") as string) || undefined,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message || "Datos inválidos";
    return { error: firstError };
  }

  const supabase = await createAuthClient();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      email: parsed.data.email,
      full_name: parsed.data.full_name,
      role: "client",
      phone: parsed.data.phone || null,
      company_name: parsed.data.company_name || null,
      ruc: parsed.data.ruc || null,
    });
  }

  redirect("/cliente");
}

export async function logoutAction() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/login");
}
