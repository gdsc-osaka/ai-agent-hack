import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { openApiSpec } from "./openapi-spec";
import env from "./env";
import { logger } from "./routes/middleware/logger";
import auth from "./routes/auth";
import authorize from "./routes/middleware/authorize";
import vector from "./routes/vector";

const app = new Hono();

// Production 環境では Firebase Hosting で /api/** のパスをリダクレクトするため、
// ここでは /api/** のパスを受け取る

app.use(logger);
app.get("/api/openapi", openApiSpec(app));
app.get("/api/ping", (c) => c.text("pong"));

// Auth
app.route("/api/v1/auth", auth);

// Vector API
app.route("/v1/vector", vector);

app.use("/api/*", authorize);

// endpoint
// app.route("/api/v1/users", users);

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
