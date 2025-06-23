import { createDefaultRoute } from "./shared/default-route";
import { z } from "zod";
import { CustomerId } from "../domain/customer";

const tags = ["Customers"];

const acceptTos = createDefaultRoute({
  method: "post",
  path: "/{customerId}/accept-tos",
  tags,
  operationId: "acceptCustomerTos",
  description: "Accept the Terms of Service for a customer.",
  request: {
    params: z.object({
      customerId: CustomerId,
    }),
  },
  responses: {
    204: {
      description: "Successfully accepted the Terms of Service.",
    },
  },
});

const declineTos = createDefaultRoute({
  method: "post",
  path: "/{customerId}/decline-tos",
  tags,
  operationId: "declineCustomerTos",
  description:
    "Decline the Terms of Service for a customer and delete their data.",
  request: {
    params: z.object({
      customerId: CustomerId,
    }),
  },
  responses: {
    204: {
      description:
        "Successfully declined the Terms of Service and deleted customer data.",
    },
  },
});

export default {
  acceptTos,
  declineTos,
};
