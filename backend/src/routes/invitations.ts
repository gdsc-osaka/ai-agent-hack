import { OpenAPIHono } from "@hono/zod-openapi";
import { fetchDBStaffByUserId } from "../infra/staff-repo";
import { fetchDBStoreById } from "../infra/store-repo";
import { getAuthUser } from "./middleware/authorize";
import { toHTTPException } from "./shared/exception";
import invitationsRoute from "./invitations.route";
import {
  acceptStaffInvitationController,
  declineStaffInvitationController,
} from "../controller/staff-invitation-controller";
import {
  acceptStaffInvitation,
  declineStaffInvitation,
} from "../service/staff-invitation-service";
import { runTransaction } from "../infra/transaction";
import {
  fetchDBStaffInvitationByToken,
  updateDBStaffInvitation,
} from "../infra/staff-invitation-repo";
import { insertDBStoreToStaff } from "../infra/store-to-staff-repo";

const app = new OpenAPIHono();

app.openapi(invitationsRoute.acceptInvitation, async (c) => {
  const { token } = c.req.valid("json");
  const res = await acceptStaffInvitationController(
    acceptStaffInvitation(
      runTransaction,
      fetchDBStaffInvitationByToken,
      fetchDBStaffByUserId,
      fetchDBStoreById,
      insertDBStoreToStaff,
      updateDBStaffInvitation
    )(getAuthUser(c), token)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }
  return c.json(res.value, 200);
});

app.openapi(invitationsRoute.declineInvitation, async (c) => {
  const { token } = c.req.valid("json");
  const res = await declineStaffInvitationController(
    declineStaffInvitation(
      runTransaction,
      fetchDBStaffInvitationByToken,
      fetchDBStaffByUserId,
      updateDBStaffInvitation
    )(getAuthUser(c), token)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }
  return c.json(res.value, 200);
});

export default app;
