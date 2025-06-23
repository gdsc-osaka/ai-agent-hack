import { OpenAPIHono } from "@hono/zod-openapi";
import { toHTTPException } from "./shared/exception";
import customersRoute from "./customers.route";
import {
  acceptCustomerTosController,
  declineCustomerTosController,
} from "../controller/customer-controller";
import {
  acceptCustomerTos,
  declineCustomerTos,
} from "../service/customer-service";
import { runTransaction } from "../infra/transaction";
import {
  deleteDBCustomerById,
  findDBCustomerById,
  updateDBCustomer,
} from "../infra/customer-repo";
import { deleteEmbedding } from "../infra/face-auth-repo";
import getFirebaseApp from "../firebase";
import env from "../env";

const app = new OpenAPIHono();

app.openapi(customersRoute.acceptTos, async (c) => {
  const { customerId } = c.req.valid("param");

  const res = await acceptCustomerTosController(
    acceptCustomerTos(
      runTransaction,
      findDBCustomerById,
      updateDBCustomer
    )(customerId)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }

  return c.body(null, 204);
});

app.openapi(customersRoute.declineTos, async (c) => {
  const { customerId } = c.req.valid("param");
  const firebaseApp = getFirebaseApp(env.FIRE_SA);

  const res = await declineCustomerTosController(
    declineCustomerTos(
      runTransaction,
      findDBCustomerById,
      deleteDBCustomerById,
      deleteEmbedding
    )(firebaseApp, customerId)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }
  return c.body(null, 204);
});

export default app;
