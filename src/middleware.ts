import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { updateSession } from "@drape/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDrape =
    pathname.startsWith("/drape") ||
    pathname.startsWith("/api/generate") ||
    pathname.startsWith("/api/generations") ||
    pathname.startsWith("/api/me") ||
    pathname.startsWith("/api/billing") ||
    pathname.startsWith("/api/auth");

  if (!isDrape) {
    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/drape/:path*", "/api/generate/:path*", "/api/generations/:path*", "/api/me", "/api/billing/:path*", "/api/auth/:path*"],
};
