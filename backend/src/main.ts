import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { openApiSpec } from "./openapiSpec";
import authorize from "./routes/middleware/authorize";
import env from "./env";
import { logger } from "./routes/middleware/logger";

const app = new Hono();

// Production 環境では Firebase Hosting で /api/** のパスを受け取る

app.use(logger);
app.get("/api/openapi", openApiSpec(app));
app.use("/api/*", authorize);
app.get("/ping", (c) => c.text("pong"));
// app.route("/api/examples", examples);

serve({
  fetch: app.fetch,
  port: env.PORT,
});

console.log("Server started");
