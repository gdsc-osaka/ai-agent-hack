import { NextResponse } from "next/server";
import { Session, User } from "better-auth";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { getSession } from "./session";
import api from "@/api";

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};

const setSession = createMiddleware<{
  Variables: {
    session: { user: User; session: Session } | null;
  };
}>(async (c, next) => {
  const cookie = getCookie(c, "__session");
  if (cookie === undefined) {
    c.set("session", null);
    return next();
  }

  const { data: session, error } = await getSession(cookie);

  if (error || !session) {
    c.set("session", null);
    return next();
  }

  c.set("session", session);
  return next();
});

const app = new Hono()
  .use("*", setSession)
  .use("/dashboard/*", async (c, next) => {
    // check session
    if (!c.get("session")) {
      return NextResponse.redirect(new URL("/login", c.req.url));
    }

    // check stores
    const { data } = await api(c.req.raw.headers).GET(
      "/api/v1/staffs/me/stores"
    );
    const stores = data?.stores;
    if (c.req.path === "/dashboard" && stores && stores.length === 0) {
      return NextResponse.redirect(new URL("/dashboard/stores/new", c.req.url));
    }

    // check search params
    const storeParam = c.req.query("store");
    if (!storeParam && stores && stores.length > 0) {
      const url = new URL(c.req.url);
      url.searchParams.set("store", stores[0].id);
      return NextResponse.redirect(url);
    }

    return next();
  })
  .use("/login", async (c, next) => {
    // check session
    const session = c.get("session");
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", c.req.url));
    }
    return next();
  })
  .use("/signup", async (c, next) => {
    // check session
    const session = c.get("session");
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", c.req.url));
    }
    return next();
  })
  .all("*", (c) => NextResponse.next({ request: c.req.raw }));

export const middleware = app.fetch;
