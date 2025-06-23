import { getAuthUser } from "./middleware/authorize";
import { toHTTPException } from "./shared/exception";
import { createStoreController } from "../controller/store-controller";
import { createStore } from "../service/store-service";
import { fetchDBStoreByPublicId, insertDBStore } from "../infra/store-repo";
import {
  fetchDBStaffByUserId,
  fetchDBStaffForStoreRoleById,
} from "../infra/staff-repo";
import { insertDBStoreToStaff } from "../infra/store-to-staff-repo";
import { runTransaction } from "../infra/transaction";
import storesRoute from "./stores.route";
import { OpenAPIHono } from "@hono/zod-openapi";
import { inviteStaffToStoreController } from "../controller/staff-invitation-controller";
import { inviteStaffToStore } from "../service/staff-invitation-service";
import {
  fetchDBStaffInvitationByEmailAndPending,
  insertDBStaffInvitation,
} from "../infra/staff-invitation-repo";
import invitationsRoute from "./invitations.route";

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

app.openapi(invitationsRoute.inviteStaffToStore, async (c) => {
  const { email, role } = c.req.valid("json");
  const res = await inviteStaffToStoreController(
    inviteStaffToStore(
      runTransaction,
      fetchDBStaffForStoreRoleById,
      fetchDBStoreByPublicId,
      fetchDBStaffInvitationByEmailAndPending,
      insertDBStaffInvitation
    )(getAuthUser(c), c.req.param("storeId"), email, role)
  );
  if (res.isErr()) {
    throw toHTTPException(res.error);
  }
  return c.json(res.value, 200);
});

export default app;
