import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import "zod-openapi/extend";
import z from "zod";
import { ApiError } from "../controller/error/api-error";

const tags = ["Vector"];

const authenticateFace = describeRoute({
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
          schema: resolver(
            z.object({
              customerId: z
                .string()
                .openapi({ description: "The ID of the authenticated user" }),
              createdAt: z.string().openapi({
                description: "Timestamp of when the user was created",
              }),
              updatedAt: z.string().openapi({
                description: "Timestamp of when the user was last updated",
              }),
            }).openapi({ ref: "Customer"})
          ),
        },
      },
    },
    403: {
      description: "Forbidden - User not authenticated",
      content: {
        "application/json": {
          schema: resolver(ApiError),
        },
      },
    },
    400: {
      description: "Bad Request - Invalid input or missing image",
      content: {
        "application/json": {
          schema: resolver(ApiError),
        },
      },
    },
  },
});

const registerFace = describeRoute({
  tags,
  validateResponse: true,
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
          schema: resolver(
            z.object({
              customerId: z
                .string()
                .openapi({ description: "The ID of registered user." }),
              createdAt: z.string().openapi({
                description: "Timestamp of when the user was created",
              }),
              updatedAt: z.string().openapi({
                description: "Timestamp of when the user was last updated",
              }),
            }).openapi({ ref: "Customer"})
          ),
        },
      },
    },
    400: {
      description: "Bad Request - Invalid input or missing image",
      content: {
        "application/json": {
          schema: resolver(ApiError),
        },
      },
    },
  },
});

export default {
  authenticateFace,
  registerFace,
};
