import { betterFetch } from "@better-fetch/fetch";
import { cookies, headers } from "next/headers";
import type { Session, User } from "better-auth";

export const getSession = async () => {
  const headerStore = await headers();

  return betterFetch<{
    user: User;
    session: Session;
  }>((process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL) + "/api/v1/auth/get-session", {
    method: "GET",
    headers: {
      Cookie: headerStore.get("Cookie") || "",
    },
    onRequest: async (ctx) => {
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get("auth.session_token")?.value;

      if (sessionToken) {
        ctx.headers.set("Cookie", `auth.session_token=${sessionToken}`);
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
  });
};
