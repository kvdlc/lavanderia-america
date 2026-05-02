import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(
            cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]
          ) {
            cookiesToSet.forEach(({ name, value }) =>
              supabaseResponse.cookies.set(name, value)
            );
          },
        },
      }
    );

    const { pathname } = request.nextUrl;
    const clientRoutes = pathname.startsWith("/cliente");
    const adminRoutes = pathname.startsWith("/admin");

    // Si no es ruta protegida, seguir
    if (!clientRoutes && !adminRoutes) {
      return supabaseResponse;
    }

    let user = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      // Supabase unavailable, proceed without user
    }

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (adminRoutes) {
      let role = "client";
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profile) role = profile.role;
      } catch {
        // Supabase unavailable, use default
      }

      if (role === "client") {
        return NextResponse.redirect(new URL("/cliente", request.url));
      }
    }

    return supabaseResponse;
  } catch {
    // Failsafe: if middleware itself crashes, let the request through
    // The page will handle auth errors on its own
    return supabaseResponse;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/cliente/:path*"],
};
