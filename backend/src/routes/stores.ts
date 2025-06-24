import { getAuthUser } from "./middleware/authorize";
import { toHTTPException } from "./shared/exception";
import { createStoreController } from "../controller/store-controller";
import { createStore } from "../service/store-service";
import {
  fetchDBStoreById,
  fetchDBStoreByPublicId,
  insertDBStore,
} from "../infra/store-repo";
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
import { faceAuthController } from "../controller/face-auth-controller";
import { authFace } from "../service/face-auth-service";
import { getFaceEmbedding } from "../infra/face-embedding-repo";
import {
  findCustomerIdByFaceEmbedding,
  insertFaceEmbedding,
} from "../infra/face-auth-repo";
import { findDBCustomerById, insertDBCustomer } from "../infra/customer-repo";
import { validateCustomer } from "../domain/customer";
import { registerCustomerController } from "../controller/customer-controller";
import { registerCustomer } from "../service/customer-service";

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

app.openapi(storesRoute.inviteStaffToStore, async (c) => {
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

app.openapi(storesRoute.authenticateFace, async (c) => {
  const { image } = c.req.valid("form");

  const res = await faceAuthController(
    authFace(
      getFaceEmbedding,
      findCustomerIdByFaceEmbedding,
      findDBCustomerById,
      validateCustomer
    )(image)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }
  return c.json(res.value, 200);
});

app.openapi(storesRoute.registerFace, async (c) => {
  const { storeId } = c.req.valid("param");
  const { image } = c.req.valid("form");

  const res = await registerCustomerController(
    registerCustomer(
      fetchDBStoreById,
      getFaceEmbedding,
      insertFaceEmbedding,
      insertDBCustomer,
      validateCustomer
    )(storeId, image)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }
  return c.json(res.value, 201);
});

export default app;
