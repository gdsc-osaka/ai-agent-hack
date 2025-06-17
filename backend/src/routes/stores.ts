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
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { zValidatorErrorHandler } from "./shared/validator-error-handler";

const app = new Hono();

app.post(
  "/",
  storesRoute.createStore,
  zValidator(
    "json",
    z.object({
      id: z.string(),
    }),
    zValidatorErrorHandler
  ),
  async (c) => {
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
    return c.json(res.value);
  }
);

export default app;
