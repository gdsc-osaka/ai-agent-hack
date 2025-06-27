import { HTTPException } from "hono/http-exception";
import { Context } from "hono";
import { AuthUser, convertToAuthUser, SessionUser } from "../../domain/auth";
import { auth } from "../../auth";
import { createMiddleware } from "hono/factory";
import { fetchDBStoreApiKeyByApiKey } from "../../infra/store-api-key-repo";
import db from "../../db/db";
import { DBStoreApiKey } from "../../domain/store-api-key";
import { Result } from "neverthrow";
import { fetchDBStoreById } from "../../infra/store-repo";
import { DBStore } from "../../domain/store";
import { getCookie } from "hono/cookie";
import { apiKeyHeaderKey } from "../../shared/const";
import { toHTTPException } from "../shared/exception";
import { HTTPErrorCarrier, StatusCode } from "../../controller/error/api-error";

export interface StoreClient {
  apiKey: DBStoreApiKey;
  store: DBStore;
}

const authorize = createMiddleware<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
    client: StoreClient | null;
  };
}>(async (c, next) => {
  const apiKeyHeader = c.req.header(apiKeyHeaderKey);
  if (apiKeyHeader !== undefined) {
    const apiKey = await fetchDBStoreApiKeyByApiKey(db)(apiKeyHeader);
    if (apiKey.isOk()) {
      const store = await fetchDBStoreById(db)(apiKey.value.storeId);
      if (store.isOk()) {
        c.set("client", { apiKey: apiKey.value, store: store.value });
      } else {
        c.set("client", null);
      }
    } else {
      c.set("client", null);
    }
  }

  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user as typeof auth.$Infer.Session.user);
  c.set("session", session.session as typeof auth.$Infer.Session.session);
  return next();
});

export const getAuthUser = (c: Context): AuthUser => {
  const authUser = c.get("user") as SessionUser | null;
  if (!authUser) {
    throw toHTTPException(
      HTTPErrorCarrier(StatusCode.Unauthorized, {
        message: "Session not found or invalid",
        code: "authorization/invalid_session",
        details: [],
      })
    );
  }
  return convertToAuthUser(authUser);
};

export const safeGetAuthUser = (
  c: Context
): Result<AuthUser, HTTPException> => {
  return Result.fromThrowable(
    () => getAuthUser(c),
    (e) => e as HTTPException
  )();
};

export const getStoreClient = (c: Context): StoreClient => {
  const client = c.get("client") as StoreClient | null;
  if (!client) {
    throw toHTTPException(
      HTTPErrorCarrier(StatusCode.Unauthorized, {
        message: "X-Api-Key not found or invalid",
        code: "authorization/invalid_api_key",
        details: [],
      })
    );
  }
  return client;
};

export const safeGetStoreClient = (
  c: Context
): Result<StoreClient, HTTPException> => {
  return Result.fromThrowable(
    () => getStoreClient(c),
    (e) => e as HTTPException
  )();
};

export default authorize;
