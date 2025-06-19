import { getAuthUser } from "./middleware/authorize";
import { toHTTPException } from "./shared/exception";
import { createStoreController } from "../controller/store-controller";
import { createStore } from "../service/store-service";
import { insertDBStore } from "../infra/store-repo";
import { fetchDBStaffByUserId } from "../infra/staff-repo";
import { insertDBStoreToStaff } from "../infra/store-to-staff-repo";
import { runTransaction } from "../infra/transaction";
import storesRoute from "./stores.route";
import { OpenAPIHono } from "@hono/zod-openapi";

const app = new OpenAPIHono();

app.openapi(storesRoute.createStore, async (c) => {
  const { id } = c.req.valid("json");
  const res = await createStoreController(
    createStore(
      insertDBStore,
      fetchDBStaffByUserId,
      insertDBStoreToStaff,
      runTransaction
    )(getAuthUser(c), id)
  );
  if (res.isErr()) {
    throw toHTTPException(res.error);
  }
  return c.json(res.value, 200);
});

export default app;
