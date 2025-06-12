import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import z from "zod";
import "zod-openapi/extend";

const tags = ["Auth"];

const getSession = describeRoute({
  tags,
  validateResponse: false,
  operationId: "getSession",
  description: "Get current session",
  responses: {
    200: {
      description: "Successful response",
      headers: {
        "auth.session_token": {
          description: "Session token for the authenticated user",
          schema: {
            type: "string",
          },
        },
      },
      content: {
        "application/json": {
          schema: resolver(
            z.object({
              session: z
                .object({
                  id: z.string(),
                  expiresAt: z.string().nullable(),
                  token: z.string(),
                  createdAt: z.string().nullable(),
                  updatedAt: z.string().nullable(),
                  ipAddress: z.string(),
                  userAgent: z.string(),
                  userId: z.string(),
                })
                .openapi({ ref: "Session" }),
              user: z
                .object({
                  id: z.string(),
                  name: z.string().nullable(),
                  email: z.string().nullable(),
                  emailVerified: z.boolean().nullable(),
                  image: z.string().nullable(),
                  createdAt: z.string().nullable(),
                  updatedAt: z.string().nullable(),
                })
                .openapi({ ref: "User" }),
            })
          ),
        },
      },
    },
  },
});

export default {
  getSession,
};
