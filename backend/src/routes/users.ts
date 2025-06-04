import { Hono } from "hono";
import { fetchUser } from "../service/user-service";
import { fetchDBUserByUid } from "../infra/user-repo";
import { getAuthUser } from "./middleware/authorize";
import usersRoute from "./users.route";
import { fetchUserController } from "../controller/user-controller";
import { toHTTPException } from "./shared/exception";

const app = new Hono();

app.get("/", usersRoute.getUser, async (c) => {
  const res = await fetchUserController(
    fetchUser(fetchDBUserByUid)(getAuthUser(c)),
  );
  if (res.isErr()) {
    throw toHTTPException(res.error);
  }
  return c.json(res.value);
});

export default app;
