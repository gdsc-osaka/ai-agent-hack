import { createRoute, RouteConfig } from "@hono/zod-openapi";
import { ApiError } from "../../controller/error/api-error";

export const createDefaultRoute = <
  P extends string,
  R extends Omit<RouteConfig, "path"> & {
    path: P;
  },
>(
  routeConfig: R
) =>
  createRoute({
    ...routeConfig,
    responses: {
      ...routeConfig.responses,
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
