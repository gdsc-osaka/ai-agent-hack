import { z } from "@hono/zod-openapi";
import { ApiError } from "../controller/error/api-error";
import { createDefaultRoute } from "./shared/default-route";

const tags = ["Vector"];

const authenticateFace = createDefaultRoute({
  method: "post",
  path: "/face-auth",
  tags,
  validateResponse: true,
  operationId: "authenticateFace",
  description: "Authenticate a user using face recognition",
  requestBody: {
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            image: {
              type: "string",
              format: "binary",
              description: "Image for face authentication",
            },
          },
          required: ["image"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successful authenticated response",
      content: {
        "application/json": {
          schema: z
            .object({
              customerId: z
                .string()
                .openapi({ description: "The ID of the authenticated user" }),
              createdAt: z.date().openapi({
                description: "Timestamp of when the user was created",
                format: "date-time",
              }),
              updatedAt: z.date().openapi({
                description: "Timestamp of when the user was last updated",
                format: "date-time",
              }),
            })
            .openapi("Customer"),
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
  requestBody: {
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            image: {
              type: "string",
              format: "binary",
              description: "Image for face registration",
            },
          },
          required: ["image"],
        },
      },
    },
  },
  responses: {
    201: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: z
            .object({
              customerId: z
                .string()
                .openapi({ description: "The ID of registered user." }),
              createdAt: z.string().openapi({
                description: "Timestamp of when the user was created",
              }),
              updatedAt: z.string().openapi({
                description: "Timestamp of when the user was last updated",
              }),
            })
            .openapi("Customer"),
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
