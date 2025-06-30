import {
  getAuthUser,
  getCustomerSession,
  getStoreClient,
  safeGetAuthUser,
  safeGetStoreClient,
} from "./middleware/authorize";
import { toHTTPException } from "./shared/exception";
import {
  createStoreController,
  fetchStoreByStoreClientController,
  fetchStoreController,
} from "../controller/store-controller";
import {
  createStore,
  fetchStore,
  fetchStoreByStoreClient,
} from "../service/store-service";
import { fetchDBStoreByPublicId, insertDBStore } from "../infra/store-repo";
import {
  fetchDBStaffByUserId,
  fetchDBStaffForStoreById,
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
import { getFaceEmbedding } from "../infra/face-embedding-repo";
import {
  findCustomerIdByFaceEmbedding,
  insertFaceEmbedding,
} from "../infra/face-auth-repo";
import {
  findDBCustomerById,
  findVisitingDBCustomersByStoreId,
  insertDBCustomer,
} from "../infra/customer-repo";
import {
  authenticateCustomerController,
  fetchVisitingCustomersController,
  registerCustomerController,
} from "../controller/customer-controller";
import {
  authenticateCustomer,
  fetchVisitingCustomers,
  registerCustomer,
} from "../service/customer-service";
import {
  insertDBVisit,
  updateDBVisitByStoreIdAndCustomerId,
} from "../infra/visit-repo";
import { HTTPErrorCarrier, StatusCode } from "../controller/error/api-error";
import {
  createStoreApiKeyController,
  fetchStoreApiKeysByStoreIdController,
} from "../controller/store-api-key-controller";
import {
  createStoreApiKey,
  fetchStoreApiKeysByStoreId,
} from "../service/store-api-key-service";
import {
  fetchDBStoreApiKeysByStoreId,
  insertDBStoreApiKey,
} from "../infra/store-api-key-repo";
import { insertDBCustomerSession } from "../infra/customer-session-repo";
import { generateProfileController } from "../controller/profiles-controller";
import { generateProfile } from "../service/profiles-service";
import { callCloudFunction } from "../infra/cloud-function-repo";

const app = new OpenAPIHono();

app.use("/:storeId/*", (c, next) => {
  const storeId = c.req.param("storeId");
  const client = safeGetStoreClient(c);
  const authUser = safeGetAuthUser(c);

  // /stores/:storeId には API キー or セッションが必要
  if (client.isErr() && authUser.isErr()) {
    throw client.error;
  }

  if (
    client.isOk() &&
    authUser.isErr() &&
    storeId !== "me" &&
    storeId !== client.value.store.publicId
  ) {
    throw toHTTPException(
      HTTPErrorCarrier(StatusCode.Forbidden, {
        message: "Permission denied: API key does not match store ID",
        code: "store/wrong_store_id",
        details: [
          {
            param: { storeId },
            apiKey: { storeId: client.value.store.publicId },
          },
        ],
      })
    );
  }

  return next();
});

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
      fetchDBStaffForStoreById,
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

app.openapi(storesRoute.authenticateCustomer, async (c) => {
  const { image } = c.req.valid("form");
  const { storeId } = c.req.valid("param");

  const res = await authenticateCustomerController(
    authenticateCustomer(
      runTransaction,
      fetchDBStoreByPublicId,
      getFaceEmbedding,
      findCustomerIdByFaceEmbedding,
      findDBCustomerById,
      insertDBVisit,
      insertDBCustomerSession,
      updateDBVisitByStoreIdAndCustomerId
    )(storeId, image)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }
  return c.json(res.value, 200);
});

app.openapi(storesRoute.registerCustomer, async (c) => {
  const { storeId } = c.req.valid("param");
  const { image } = c.req.valid("form");

  const res = await registerCustomerController(
    registerCustomer(
      runTransaction,
      fetchDBStoreByPublicId,
      getFaceEmbedding,
      insertFaceEmbedding,
      insertDBCustomer,
      insertDBVisit,
      insertDBCustomerSession
    )(storeId, image)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }
  return c.json(res.value, 201);
});

// face auth の signOut に集約する
// app.openapi(storesRoute.checkoutCustomer, async (c) => {
//   const { storeId, customerId } = c.req.valid("param");
//
//   const res = await checkoutCustomerController(
//     checkoutCustomer(
//       runTransaction,
//       fetchDBVisitByStoreIdAndCustomerId,
//       updateDBVisitById
//     )(customerId, storeId)
//   );
//
//   if (res.isErr()) {
//     throw toHTTPException(res.error);
//   }
//   return c.text("ok", 201);
// });

app.openapi(storesRoute.generateProfile, async (c) => {
  const { file } = c.req.valid("form");

  const res = await generateProfileController(
    generateProfile(callCloudFunction)(file, getCustomerSession(c).customerId)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }

  return c.json(res.value, 200);
});

app.openapi(storesRoute.getCustomersByStore, async (c) => {
  const { storeId } = c.req.valid("param");
  // const { status } = c.req.valid("query");

  const res = await fetchVisitingCustomersController(
    fetchVisitingCustomers(
      fetchDBStoreByPublicId,
      findVisitingDBCustomersByStoreId
    )(storeId)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }
  return c.json(res.value, 200);
});

app.openapi(storesRoute.getStoreByMe, async (c) => {
  const res = await fetchStoreByStoreClientController(
    fetchStoreByStoreClient()(getStoreClient(c))
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }

  return c.json(res.value, 200);
});

app.openapi(storesRoute.getStoreById, async (c) => {
  const { storeId } = c.req.valid("param");

  const res = await fetchStoreController(
    fetchStore(fetchDBStoreByPublicId)(storeId)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }

  return c.json(res.value, 200);
});

app.openapi(storesRoute.createStoreApiKey, async (c) => {
  const { storeId } = c.req.valid("param");

  const res = await createStoreApiKeyController(
    createStoreApiKey(
      fetchDBStaffForStoreById,
      fetchDBStoreByPublicId,
      insertDBStoreApiKey
    )(getAuthUser(c), storeId)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }

  return c.json(res.value, 200);
});

app.openapi(storesRoute.getStoreApiKeys, async (c) => {
  const { storeId } = c.req.valid("param");

  const res = await fetchStoreApiKeysByStoreIdController(
    fetchStoreApiKeysByStoreId(
      fetchDBStoreApiKeysByStoreId,
      fetchDBStoreByPublicId
    )(storeId)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }

  return c.json(
    {
      apiKeys: res.value,
    },
    200
  );
});

export default app;
