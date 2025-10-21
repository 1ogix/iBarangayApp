import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protected routes that require login
  const protectedRoutes = ["/admin", "/user"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("message", "Please log in to access this page.");
    return NextResponse.redirect(url);
  }

  // Role-based access for admin routes
  if (user && pathname.startsWith("/admin")) {
    // Assumes role is in app_metadata. Adjust if your setup is different.
    const role = user.app_metadata?.role;
    if (role !== "admin") {
      const url = request.nextUrl.clone();
      // Redirect non-admins to their user dashboard or an unauthorized page
      url.pathname = "/user"; 
      url.searchParams.set(
        "message",
        "You are not authorized to access this page."
      );
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$)).*",
  ],
};
