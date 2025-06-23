import { OpenAPIHono } from "@hono/zod-openapi";

export const MyOpenAPIHono = (args: { docPath: string }) => {
  const app = new OpenAPIHono();

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

  return app;
};
