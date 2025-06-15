import { Hono } from "hono";
import { getAuthUser } from "./middleware/authorize";
import { toHTTPException } from "./shared/exception";
import { createStoreController } from "../controller/store-controller";
import { createStore } from "../service/store-service";
import { insertDBStore } from "../infra/store-repo";
import { fetchDBStaffByUserId } from "../infra/staff-repo";
import { insertDBStoreToStaff } from "../infra/store-to-staff-repo";
import { runTransaction } from "../infra/transaction";
import storesRoute from "./stores.route";

const app = new Hono();

app.post("/", storesRoute.createStore, async (c) => {
  const json = await c.req.json();
  console.log("json", json);
  const res = await createStoreController(
    createStore(
      insertDBStore,
      fetchDBStaffByUserId,
      insertDBStoreToStaff,
      runTransaction
    )(getAuthUser(c), json.id)
  );
  if (res.isErr()) {
    throw toHTTPException(res.error);
  }
  return c.json(res.value);
});

export default app;
