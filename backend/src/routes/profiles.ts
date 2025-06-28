import { OpenAPIHono } from "@hono/zod-openapi";
import { toHTTPException } from "./shared/exception";
import profilesRoute from "./profiles.route";
import { generateProfileController } from "../controller/profiles-controller";
import { generateProfile } from "../service/profiles-service";
import { callCloudFunction } from "../infra/cloud-function-repo";

const app = new OpenAPIHono();

app.openapi(profilesRoute.generateProfile, async (c) => {
  const { file } = c.req.valid("form");

  const res = await generateProfileController(
    generateProfile(callCloudFunction)(file)
  );

  if (res.isErr()) {
    throw toHTTPException(res.error);
  }

  return c.json(res.value, 200);
});

export default app;
