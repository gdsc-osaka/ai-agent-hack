import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { authDB } from "./db/db";
import { authSchema } from "./db/schema";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/plugins";
import env from "./env";

export const auth = betterAuth({
  advanced: {
    // サブドメインで Cookie 共有する場合はコメントアウト
    // crossSubDomainCookies: {
    //   enabled: true
    // }
    cookiePrefix: "auth",
  },
  secret: env.AUTH_SECRET,
  basePath: "/api/v1/auth",
  trustedOrigins: [env.WEB_SERVER_URL],
  database: drizzleAdapter(authDB, {
    provider: "pg",
    schema: authSchema,
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    nextCookies(),
    // /api/v1/auth/reference で OpenAPI Spec を取得する
    // openAPI(),
  ],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up")) {
        // TODO: ユーザー登録時の処理
      }
    }),
  },
});
