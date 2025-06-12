import { Hono } from "hono";
import { cors } from "hono/cors";
import env from "../env";
import { auth } from "../auth";
import { createMiddleware } from "hono/factory";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: [env.WEB_SERVER_URL],
    credentials: true,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

const authHandler = createMiddleware(async (c) => {
  return auth.handler(c.req.raw);
});

// OpenAPI spec があるものは個別で定義
// セッショントークンを Cookie に記述する必要があるため, OpenAPI Spec を定義してもいい

// 現状は認証用の OpenAPI Spec は不要なのと, middleware を挟むと
// その他の認証エンドポイントにリクエストが届かなくなるため
// コメントアウト

// app.get("/get-session", authRoute.getSession, authHandler);
// app.post("/sign-in/email", authHandler);
// app.post("/sign-out", authHandler);

// その他
app.on(["GET", "POST"], "/**", authHandler);

export default app;
