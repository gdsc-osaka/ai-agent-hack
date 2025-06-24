import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import env from "./env";

export const MyOpenAPIHono = (args: {
  docPath: string;
  swaggerPath: string;
}) => {
  const app = new OpenAPIHono();

  if (env.NODE_ENV === "production") {
    return app;
  }

  app.doc(args.docPath, {
    openapi: "3.0.0",
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
        session: [],
      },
    ],
  });

  app.openAPIRegistry.registerComponent("securitySchemes", "session", {
    type: "apiKey",
    in: "cookie",
    name: "__session",
  });

  app.get(
    args.swaggerPath,
    swaggerUI({
      url: args.docPath,
    })
  );

  return app;
};
