import { createAuthClient } from "better-auth/react";
import { nextCookies } from "better-auth/next-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const { signIn, signOut, signUp, getSession } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  basePath: "/api/v1/auth",
  plugins: [nextCookies()],
  fetchOptions: {
    onRequest: async (ctx) => {
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get("auth.session_token")?.value;
      if (sessionToken) {
        ctx.headers.set("cookie", `auth.session_token=${sessionToken}`);
      }
    },
    // headers
    onResponse: async (ctx) => {
      const setCookie = ctx.response.headers.get("Set-Cookie");
      const sessionToken = setCookie?.match(/auth\.session_token=([^;]+)/)?.[1];
      if (sessionToken) {
        const cookieStore = await cookies();
        cookieStore.set("auth.session_token", sessionToken);
      }
    },
    onSuccess: async () => {
      redirect("/dashboard");
    },
  },
});
