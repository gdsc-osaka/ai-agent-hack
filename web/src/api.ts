import createClient from "openapi-fetch";
import { components, paths } from "./openapi/types";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;

// サーバーサイドから呼び出す際は headers を渡す
export default (
  authorization?: Headers | (() => Promise<ReadonlyHeaders>) | string
) =>
  createClient<paths>({
    baseUrl,
    fetch: async (req) => {
      const headerOrApiKey = typeof authorization === "function"
        ? await authorization()
        : authorization;
      const mergedHeaders = new Headers(req.headers);
      if (typeof headerOrApiKey === "string") {
        mergedHeaders.set("X-Api-Key", headerOrApiKey);
      } else {
        headerOrApiKey?.forEach((value, key) => {
          mergedHeaders.set(key, value);
        });
      }
      return fetch(req, {
        headers: mergedHeaders,
        method: req.method,
        credentials: "include",
      });
    },
  });

export type Store = components["schemas"]["Store"];
