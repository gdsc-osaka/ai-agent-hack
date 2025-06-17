import { betterFetch } from "@better-fetch/fetch";
import { cookies, headers } from "next/headers";
import type { Session, User } from "better-auth";

export const getSession = async (sessionCookie?: string) => {
  const sessionToken =
    sessionCookie ??
    (await headers()).get("cookie")?.match(/__session=([^;]+)/)?.[1];

  return betterFetch<{
    user: User;
    session: Session;
  }>(
    `${process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL}/api/v1/auth/get-session`,
    {
      method: "GET",
      headers: {
        Cookie: sessionToken ? `__session=${sessionToken}` : "",
      },
      onResponse: async (ctx) => {
        const setCookie = ctx.response.headers.get("Set-Cookie");
        const sessionToken = setCookie?.match(/__session=([^;]+)/)?.[1];
        if (sessionToken) {
          const cookieStore = await cookies();
          cookieStore.set("__session", sessionToken);
        }
      },
    }
  );
};
