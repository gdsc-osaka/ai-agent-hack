import { Store } from "../domain/store";
import { z } from "zod";
import { ApiError } from "../controller/error/api-error";
import { createDefaultRoute } from "./shared/default-route";

const tags = ["Stores"];

const createStore = createDefaultRoute({
  method: "post",
  path: "/",
  tags,
  operationId: "createStore",
  description: "Create a new store",
  security: [
    {
      session: [],
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            id: z.string().describe("Unique identifier for the store"),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: Store,
        },
      },
      description: "Create store response",
    },
    400: {
      description: "Bad Request - Invalid input or missing image",
      content: {
        "application/json": {
          schema: ApiError,
        },
      },
    },
  },
});

const fetchStoresForStaff = createDefaultRoute({
  method: "get",
  path: "/me/stores",
  tags,
  validateResponse: true,
  operationId: "fetchStoresForStaff",
  description: "Fetch stores for staff",
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: z.object({
            stores: Store.array(),
          }),
        },
      },
    },
  },
});

export default {
  createStore,
  fetchStoresForStaff,
};
