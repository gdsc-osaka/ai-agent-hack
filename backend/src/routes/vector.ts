import vectorRoute from "./vector.route";
import { OpenAPIHono } from "@hono/zod-openapi";
import { faceAuthController } from "../controller/face-auth-controller";
import { getFaceEmbedding } from "../infra/face-embedding-repo";
import { authenticateFace, registerEmbedding } from "../infra/face-auth-repo";
import { insertDBCustomer, findDBCustomerById } from "../infra/customer-repo";
import { toHTTPException } from "./shared/exception";
import { authFace } from "../service/face-auth-service";
import { registerCustomer } from "../service/customer-service";
import { registerCustomerController } from "../controller/customer-controller";
import { validateCustomer } from "../domain/customer";
import { fetchDBStoreById } from "../infra/store-repo";

const app = new OpenAPIHono();

app.openapi(vectorRoute.authenticateFace, async (c) => {
  const { image } = c.req.valid("form");

  const res = await faceAuthController(
    authFace(
      getFaceEmbedding,
      authenticateFace,
      findDBCustomerById,
      validateCustomer
    )(image)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }
  return c.json(res.value, 200);
});

app.openapi(vectorRoute.registerFace, async (c) => {
  const { image } = c.req.valid("form");

  const res = await registerCustomerController(
    registerCustomer(
      fetchDBStoreById,
      getFaceEmbedding,
      registerEmbedding,
      insertDBCustomer,
      validateCustomer
    )("dummy", image)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }
  return c.json(res.value, 201);
});

export default app;
