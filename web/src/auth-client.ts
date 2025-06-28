"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Preview 環境では API サーバーと同じオリジンで動作するため、window.location.origin を使用
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:8080"),
  basePath: "/api/v1/auth",
  // plugins: [nextCookies()],
  // fetchOptions: {
  //   onRequest: async (ctx) => {
  //     const sessionToken = getCookie("auth.session_token");
  //     console.log("Session Token from cookie:", sessionToken);
  //
  //     if (sessionToken) {
  //       ctx.headers.set("cookie", `auth.session_token=${sessionToken}`);
  //     }
  //   },
  //   onResponse: async (ctx) => {
  //     const setCookies = ctx.response.headers.get("Set-Cookie");
  //     console.log("Set-Cookie", setCookies);
  //     console.log("Headers", Object.fromEntries(ctx.response.headers.entries()));
  //     const sessionToken = setCookieHeader?.match(
  //       /auth\.session_token=([^;]+)/
  //     )?.[1];
  //     console.log("Session Token from response:", sessionToken);
  //     if (sessionToken) {
  //       setCookie("__session", sessionToken);
  //     }
  //   },
  // },
});
