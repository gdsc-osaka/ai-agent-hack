import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { User } from "../domain/user";

const tags = ["Users"];

const getUser = describeRoute({
  tags,
  validateResponse: true,
  operationId: "getUser",
  description: "Get user information",
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: resolver(User),
        },
      },
    },
  },
});

export default {
  getUser,
};
