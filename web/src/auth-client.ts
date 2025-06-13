import { createAuthClient } from "better-auth/react";
import { nextCookies } from "better-auth/next-js";
import { getCookie, setCookie } from "typescript-cookie";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  basePath: "/api/v1/auth",
  plugins: [nextCookies()],
  fetchOptions: {
    onRequest: async (ctx) => {
      const sessionToken = getCookie("auth.session_token");

      if (sessionToken) {
        ctx.headers.set("cookie", `auth.session_token=${sessionToken}`);
      }
    },
    onResponse: async (ctx) => {
      const setCookieHeader = ctx.response.headers.get("Set-Cookie");
      const sessionToken = setCookieHeader?.match(/auth\.session_token=([^;]+)/)?.[1];
      if (sessionToken) {
        setCookie("auth.session_token", sessionToken);
      }
    }
  },
});
