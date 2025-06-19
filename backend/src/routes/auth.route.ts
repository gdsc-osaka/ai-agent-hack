import { z } from "@hono/zod-openapi";
import { createDefaultRoute } from "./shared/default-route";

const tags = ["Auth"];

const getSession = createDefaultRoute({
  method: "get",
  path: "/get-session",
  tags,
  validateResponse: false,
  operationId: "getSession",
  description: "Get current session",
  responses: {
    200: {
      description: "Successful response",
      headers: {
        __session: {
          description: "Session token for the authenticated user",
          schema: {
            type: "string",
          },
        },
      },
      content: {
        "application/json": {
          schema: z.object({
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
              .openapi("Session"),
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
              .openapi("User"),
          }),
        },
      },
    },
  },
});

export default {
  getSession,
};
