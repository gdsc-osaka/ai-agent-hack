import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { openApiSpec } from "./openapi-spec";
import env from "./env";
import { logger } from "./routes/middleware/logger";
import authorize from "./routes/middleware/authorize";
import auth from "./routes/auth";
import stores from "./routes/stores";
import vector from "./routes/vector";
import staffs from "./routes/staffs";
import { cors } from "hono/cors";

const app = new Hono();

// Production 環境では Firebase Hosting で /api/** のパスをリダクレクトするため、
// ここでは /api/** のパスを受け取る

app.use(
  "/*",
  cors({
    origin: [env.TRUSTED_ORIGIN_WEB],
    credentials: true,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);
app.use(logger);
app.get("/api/openapi", openApiSpec(app));
app.get("/api/ping", (c) => c.text("pong"));

// Auth
app.route("/api/v1/auth", auth);

app.use("/api/*", authorize);

// endpoint
app.route("/api/v1/vector", vector);
app.route("/api/v1/stores", stores);
app.route("/api/v1/staffs", staffs);

serve({
  fetch: app.fetch,
  port: env.PORT,
});

console.log(
  "Server started" +
    (env.NODE_ENV === "development"
      ? ` at http://localhost:${env.PORT}/api`
      : "")
);
