import { createMiddleware } from "hono/factory";
import { accessLogger } from "../../logger";

export const logger = createMiddleware(async (c, next) => {
  const { method, path } = c.req;
  const headers = Array.from(c.req.raw.headers.entries())
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
  accessLogger("<--").info(`${method}#${path}\n\tHeaders: ${headers}`);

  const start = Date.now();
  const res = await next();
  const end = Date.now();

  const status = c.res.status;

  accessLogger("-->").info(`${method}#${path} ${status} ${end - start}ms`);

  return res;
});
