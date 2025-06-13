import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { authDB } from "./db/db";
import { authSchema } from "./db/schema";
import { nextCookies } from "better-auth/next-js";
import env from "./env";

export const auth = betterAuth({
  advanced: {
    // サブドメインで Cookie 共有する場合はコメントアウト
    crossSubDomainCookies: {
      enabled: true,
      domain: env.AUTH_COOKIE_DOMAIN,
    },
    cookiePrefix: "auth",
  },
  secret: env.AUTH_SECRET,
  basePath: "/api/v1/auth",
  trustedOrigins: [env.TRUSTED_ORIGIN_WEB],
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
    // TODO: ユーザー登録時に DB にデータを追加する
    // after: createAuthMiddleware(async (ctx) => {
    //   if (ctx.path.startsWith("/sign-up")) {
    //   }
    // }),
  },
});
