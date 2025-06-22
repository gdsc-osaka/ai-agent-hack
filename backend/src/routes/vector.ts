import vectorRoute from "./vector.route";
import getFirebaseApp from "../firebase";
import env from "../env";
import { OpenAPIHono } from "@hono/zod-openapi";
import { faceAuthController } from "../controller/face-auth-controller";
import { getFaceEmbedding } from "../infra/face-embedding-repo";
import { authenticateFace, registerEmbedding } from "../infra/face-auth-repo";
import { createDBCustomer, findDBCustomerById } from "../infra/customer-repo";
import { toHTTPException } from "./shared/exception";
import { authFace } from "../service/face-auth-service";
import { registerCustomer } from "../service/customer-service";
import { registerCustomerController } from "../controller/customer-controller";
import { validateCustomer } from "../domain/customer";

const app = new OpenAPIHono();

app.openapi(vectorRoute.authenticateFace, async (c) => {
  const formData = await c.req.formData();
  const image = formData.get("image") as File;

  const firebase = getFirebaseApp(env.FIRE_SA);

  const res = await faceAuthController(
    authFace(
      getFaceEmbedding,
      authenticateFace,
      findDBCustomerById,
      validateCustomer
    )(firebase, image)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }
  return c.json(res.value, 200);
});

app.openapi(vectorRoute.registerFace, async (c) => {
  const formData = await c.req.formData();
  const image = formData.get("image") as File;

  const firebase = getFirebaseApp(env.FIRE_SA);

  const res = await registerCustomerController(
    registerCustomer(
      getFaceEmbedding,
      registerEmbedding,
      createDBCustomer,
      validateCustomer
    )(firebase, image)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }
  return c.json(res.value, 201);
});

export default app;
