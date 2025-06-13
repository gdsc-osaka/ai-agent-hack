"use client";

import { createAuthClient } from "better-auth/react";
import { nextCookies } from "better-auth/next-js";
import { getCookie } from "typescript-cookie";

export const authClient = createAuthClient({
  // Preview 環境では API サーバーと同じオリジンで動作するため、window.location.origin を使用
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    (typeof window !== "undefined" ? window.location.origin : undefined),
  basePath: "/api/v1/auth",
  plugins: [nextCookies()],
  fetchOptions: {
    onRequest: async (ctx) => {
      const sessionToken = getCookie("auth.session_token");

      if (sessionToken) {
        ctx.headers.set("cookie", `auth.session_token=${sessionToken}`);
      }
    },
    // onResponse: async (ctx) => {
    //   const setCookieHeader = ctx.response.headers.get("Set-Cookie");
    //   const sessionToken = setCookieHeader?.match(
    //     /auth\.session_token=([^;]+)/
    //   )?.[1];
    //   if (sessionToken) {
    //     setCookie("auth.session_token", sessionToken);
    //   }
    // },
  },
});
