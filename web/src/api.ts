import createClient from "openapi-fetch";
import { components, paths } from "./openapi/types";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:8080";

// サーバーサイドから呼び出す際は headers を渡す
const api = (
  authorization?:
    | Headers
    | (() => Promise<ReadonlyHeaders>)
    | string
    | CustomerSession
) =>
  createClient<paths>({
    baseUrl,
    fetch: async (req) => {
      const headerOrApiKey =
        typeof authorization === "function"
          ? await authorization()
          : authorization;
      const mergedHeaders = new Headers(req.headers);
      if (typeof headerOrApiKey === "string") {
        /* API Key */
        mergedHeaders.set("X-Api-Key", headerOrApiKey);
      } else if (headerOrApiKey && "token" in headerOrApiKey) {
        /* CustomerSession */
        mergedHeaders.set("X-Session-Token", headerOrApiKey.token);
      } else {
        /* Headers that passed from server-side */
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

export type Api = ReturnType<typeof api>;
export type Store = components["schemas"]["Store"];
export type CustomerSession = components["schemas"]["CustomerSession"];
export type ApiError = components["schemas"]["ApiError"];

export const bodySerializers = {
  form: <T extends Record<string, string | Blob> | undefined>(body: T) => {
    const fd = new FormData();
    for (const name in body) {
      fd.append(name, body[name]);
    }
    return fd;
  },
};

export default api;
