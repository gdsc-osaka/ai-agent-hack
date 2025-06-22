import { getAuthUser } from "./middleware/authorize";
import { toHTTPException } from "./shared/exception";
import storesRoute from "./stores.route";
import { fetchStoresForStaffController } from "../controller/store-controller";
import { fetchStoresForStaff } from "../service/store-service";
import { fetchDBStaffByUserId } from "../infra/staff-repo";
import { fetchDBStoresForStaff } from "../infra/store-repo";
import { OpenAPIHono } from "@hono/zod-openapi";

const app = new OpenAPIHono();

app.openapi(storesRoute.fetchStoresForStaff, async (c) => {
  const res = await fetchStoresForStaffController(
    fetchStoresForStaff(
      fetchDBStaffByUserId,
      fetchDBStoresForStaff
    )(getAuthUser(c))
  );
  if (res.isErr()) {
    throw toHTTPException(res.error);
  }
  return c.json(
    {
      stores: res.value,
    },
    200
  );
});

export default app;
