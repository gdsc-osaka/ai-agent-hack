import vectorRoute from "./vector.route";
import getFirebaseApp from "../firebase";
import env from "../env";
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

const app = new OpenAPIHono();

app.openapi(vectorRoute.authenticateFace, async (c) => {
  try {
    const { image } = c.req.valid("form");
    console.log('Face authentication request received, image size:', image.size);

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
      console.error('Face authentication error:', res.error);
      throw toHTTPException(res.error);
    }
    return c.json(res.value, 200);
  } catch (error) {
    console.error('Unexpected error in face authentication:', error);
    throw error;
  }
});

app.openapi(vectorRoute.registerFace, async (c) => {
  try {
    const { image } = c.req.valid("form");
    console.log('Face registration request received, image size:', image.size);

    const firebase = getFirebaseApp(env.FIRE_SA);

    const res = await registerCustomerController(
      registerCustomer(
        getFaceEmbedding,
        registerEmbedding,
        insertDBCustomer,
        validateCustomer
      )(firebase, image)
    );

    if (res.isErr()) {
      console.error('Face registration error:', res.error);
      throw toHTTPException(res.error);
    }
    return c.json(res.value, 201);
  } catch (error) {
    console.error('Unexpected error in face registration:', error);
    throw error;
  }
});

export default app;
