import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { openApiSpec } from "./openapiSpec";
import authorize from "./routes/middleware/authorize";
import env from "./env";
import { logger } from "./routes/middleware/logger";
import users from "./routes/users";

const app = new Hono();

// Production 環境では Firebase Hosting で /api/** のパスをリダクレクトするため、
// ここでは /api/** のパスを受け取る

app.use(logger);
app.get("/api/openapi", openApiSpec(app));
app.get("/api/ping", (c) => c.text("pong"));
app.use("/api/*", authorize);
app.route("/api/v1/users", users);

serve({
  fetch: app.fetch,
  port: env.PORT,
});

console.log("Server started");
