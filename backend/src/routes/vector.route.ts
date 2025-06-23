import z from "zod";
import { ApiError } from "../controller/error/api-error";
import { createDefaultRoute } from "./shared/default-route";
import { Customer } from "../domain/customer";

const tags = ["Vector"];

const authenticateFace = createDefaultRoute({
  method: "post",
  path: "/face-auth",
  tags,
  validateResponse: true,
  operationId: "authenticateFace",
  description: "Authenticate a user using face recognition",
  request: {
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
  path: "/face",
  tags,
  operationId: "registerFace",
  description: "Register a user's face for authentication",
  request: {
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
  authenticateFace,
  registerFace,
};
