import createClient from "openapi-fetch";
import { paths } from "./openapi";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { Session } from "better-auth";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;

// サーバーサイドから呼び出す際は headers を渡す
export default (headersOrSession: Session | (() => Promise<ReadonlyHeaders>)) =>
  createClient<paths>({
    baseUrl,
    fetch: async (req) => {
      return fetch(req, {
        headers:
          "token" in headersOrSession
            ? {
                Cookie: `__session=${headersOrSession.token}`,
              }
            : await headersOrSession(),
        method: req.method,
        credentials: "include",
      });
    },
  });
