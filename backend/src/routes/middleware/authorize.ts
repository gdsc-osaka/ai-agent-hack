import { HTTPException } from "hono/http-exception";
import { Context } from "hono";
import { AuthUser, SessionUser, convertToAuthUser } from "../../domain/auth";
import { auth } from "../../auth";
import { createMiddleware } from "hono/factory";

const authorize = createMiddleware<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

export const getAuthUser = (c: Context): AuthUser => {
  const authUser = c.get("user") as SessionUser | null;
  if (!authUser) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  return convertToAuthUser(authUser);
};

export default authorize;
