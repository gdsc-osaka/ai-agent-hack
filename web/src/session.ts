import { betterFetch } from "@better-fetch/fetch";
import { cookies, headers } from "next/headers";
import type { Session, User } from "better-auth";

export const getSession = async (header?: Headers) => {
  const headerStore = header ?? (await headers());

  console.debug("Header in request:", JSON.stringify(header));
  console.debug("Header in headers:", JSON.stringify(await headers()));
  console.debug("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
  console.debug("API_URL:", process.env.API_URL);

  return betterFetch<{
    user: User;
    session: Session;
  }>(
    new URL(
      "/api/v1/auth/get-session",
      process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL
    ).toString(),
    {
      method: "GET",
      headers: headerStore,
      // headers
      onResponse: async (ctx) => {
        const setCookie = ctx.response.headers.get("Set-Cookie");
        const sessionToken = setCookie?.match(
          /auth\.session_token=([^;]+)/
        )?.[1];
        if (sessionToken) {
          const cookieStore = await cookies();
          cookieStore.set("auth.session_token", sessionToken);
        }
      },
    }
  );
};
