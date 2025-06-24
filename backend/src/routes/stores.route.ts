import { Store } from "../domain/store";
import { z } from "zod";
import { ApiError } from "../controller/error/api-error";
import { createDefaultRoute } from "./shared/default-route";
import { Customer } from "../domain/customer";

const TAG_STORE = "Stores";
const TAG_CUSTOMER = "Customers";

const createStore = createDefaultRoute({
  method: "post",
  path: "/",
  tags: [TAG_STORE],
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

const authenticateFace = createDefaultRoute({
  method: "post",
  path: "/{storeId}/face-recognition/authenticate",
  tags: [TAG_CUSTOMER],
  validateResponse: true,
  operationId: "authenticateFace",
  description: "Authenticate a user using face recognition",
  request: {
    params: z.object({
      storeId: z.string().describe("ID of the store to invite staff to"),
    }),
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            image: z.instanceof(File).describe("Image for face authentication"),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successful authenticated response",
      content: {
        "application/json": {
          schema: Customer,
        },
      },
    },
    403: {
      description: "Forbidden - User not authenticated",
      content: {
        "application/json": {
          schema: ApiError,
        },
      },
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

const registerFace = createDefaultRoute({
  method: "post",
  path: "/{storeId}/face-recognition/register",
  tags: [TAG_CUSTOMER],
  operationId: "registerFace",
  description: "Register a user's face for authentication",
  request: {
    params: z.object({
      storeId: z.string().describe("ID of the store to invite staff to"),
    }),
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            image: z.instanceof(File).describe("Image for face authentication"),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: Customer,
        },
      },
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

export default {
  createStore,
  authenticateFace,
  registerFace,
};
