import { z } from "zod";
import { Profile } from "../domain/profile";
import { createDefaultRoute } from "./shared/default-route";
import tags from "./shared/tags";
import { ApiError } from "../controller/error/api-error";

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
            file: z.instanceof(File).describe("Audio file"),
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
            profile: z.array(Profile),
          }),
        },
      },
    },
    400: {
      description: "Bad Request - Invalid input or missing file",
      content: {
        "application/json": {
          schema: ApiError,
        },
      },
    },
    500: {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: ApiError,
        },
      },
    },
  },
});

export default {
  generateProfile,
};
