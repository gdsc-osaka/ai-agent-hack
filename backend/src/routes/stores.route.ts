import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { Store } from "../domain/store";

const tags = ["Stores"];

const createStore = describeRoute({
  tags,
  validateResponse: true,
  operationId: "createStore",
  description: "Create a new store",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the store",
            },
          },
          required: ["id"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: resolver(Store),
        },
      },
    },
  },
});

const fetchStoresForStaff = describeRoute({
  tags,
  validateResponse: true,
  operationId: "fetchStoresForStaff",
  description: "Fetch stores for staff",
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: resolver(Store.array()),
        },
      },
    },
  },
});

export default {
  createStore,
  fetchStoresForStaff,
};
