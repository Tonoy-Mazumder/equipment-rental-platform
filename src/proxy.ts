
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get current user session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Redirect unauthenticated users
  if (!session) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  const role = session.user.role;

  // Check dashboard access by role
  if (
    pathname.startsWith("/dashboard/admin") &&
    role !== "admin"
  ) {
    return NextResponse.redirect(
      new URL(`/dashboard/${role}`, request.url)
    );
  }

  if (
    pathname.startsWith("/dashboard/owner") &&
    role !== "owner"
  ) {
    return NextResponse.redirect(
      new URL(`/dashboard/${role}`, request.url)
    );
  }

  if (
    pathname.startsWith("/dashboard/customer") &&
    role !== "customer"
  ) {
    return NextResponse.redirect(
      new URL(`/dashboard/${role}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
