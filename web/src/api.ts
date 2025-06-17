import createClient from "openapi-fetch";
import { components, paths } from "./openapi/types";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;

// サーバーサイドから呼び出す際は headers を渡す
export default (
  headersOrSession?: Headers | (() => Promise<ReadonlyHeaders>)
) =>
  createClient<paths>({
    baseUrl,
    fetch: async (req) => {
      return fetch(req, {
        headers:
          typeof headersOrSession === "function"
            ? await headersOrSession()
            : headersOrSession,
        method: req.method,
        credentials: "include",
      });
    },
  });

export type Store = components["schemas"]["Store"];
