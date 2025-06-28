import { z } from "zod";
import { createDefaultRoute } from "./shared/default-route";
import tags from "./shared/tags";

const generateProfile = createDefaultRoute({
  method: "post",
  path: "/generate-profile",
  tags: tags.profiles,
  validateResponse: true,
  operationId: "generateProfile",
  description: "Generate profile data using Gemini",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            file: z
              .instanceof(File)
              .openapi({ type: "string", format: "binary" })
              .describe("Audio file"),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successfully generated profile data",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string().describe("Success message"),
            taskId: z
              .string()
              .describe("Task ID for tracking the profile generation"),
          }),
        },
      },
    },
  },
});

export default {
  generateProfile,
};
