import { NextRequest, NextResponse } from "next/server";
import { getSession } from './session';

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};

export async function middleware(request: NextRequest) {
  const { data: session } = await getSession();

  if (request.nextUrl.pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (["/login", "/signup"].includes(request.nextUrl.pathname) && session) {
    // If the user is already logged in, redirect them to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
