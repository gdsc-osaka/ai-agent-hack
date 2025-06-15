import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import z from "zod";

const tags = ["Vector"];

const authenticateFace = describeRoute({
  tags,
  validateResponse: true,
  operationId: "createDiary",
  description: "Create a new diary",
  requestBody: {
    content: {
        "multipart/form-data": {
        schema: {
            type: "object",
            properties: {
            image: {
                type: "string",
                format: "binary",
                description: "Image for diary generation",
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
                embedding: z.array(z.number()).openapi({ description: "Face embedding vector" }),
            })
          ),
        },
      },
    },
    403: {
        description: "Forbidden - User not authenticated",
    },
    400: {
        description: "Bad Request - Invalid input or missing image",
        content: {
            "application/json": {
                schema: resolver(
                z.object({
                    error: z.string().openapi({ description: "Error message describing the issue" }),
                })
                ),
            },
        }
    }
  },
});

export default { 
    authenticateFace,
}