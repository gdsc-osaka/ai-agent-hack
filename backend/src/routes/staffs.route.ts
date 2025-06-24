import { createDefaultRoute } from "./shared/default-route";
import { z } from "zod";
import { Store } from "../domain/store";

const TAG_STORE = "Stores";

const fetchStoresForStaff = createDefaultRoute({
  method: "get",
  path: "/me/stores",
  tags: [TAG_STORE],
  validateResponse: true,
  operationId: "fetchStoresForStaff",
  description: "Fetch stores for staff",
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: z.object({
            stores: Store.array(),
          }),
        },
      },
    },
  },
});

export default {
  fetchStoresForStaff,
};
