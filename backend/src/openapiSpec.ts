import { openAPISpecs } from "hono-openapi";
import { Hono } from "hono";

export const openApiSpec = (app: Hono) =>
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "Recall you API",
        version: "1.0.0",
        description: "API for Recall you",
      },
      servers: [
        {
          url: "https://recall-you.web.app",
          description: "Production Server",
        },
        { url: "http://localhost:8080", description: "Local Server" },
      ],
      security: [
        {
          bearerAuth: [],
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });
