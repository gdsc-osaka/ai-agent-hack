import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./session";
import { cookies } from "next/headers";

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};

export async function middleware(request: NextRequest) {
  console.log("Raw cookie header", request.headers.get("cookie"));
  console.log("Request.cookies (Parsed by Next.js)", request.cookies.getAll());
  console.log("cookies().getAll()", (await cookies()).getAll());
  console.log("Headers", Object.fromEntries(request.headers.entries()));

  const { data: session } = await getSession(request.cookies);

  if (request.nextUrl.pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (["/login", "/signup"].includes(request.nextUrl.pathname) && session) {
    // If the user is already logged in, redirect them to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const res = NextResponse.next();

  return res;
}
