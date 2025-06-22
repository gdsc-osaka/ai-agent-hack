import { Store } from "../domain/store";
import { z } from "zod";
import { ApiError } from "../controller/error/api-error";
import { createDefaultRoute } from "./shared/default-route";
import { StaffRole } from "../domain/store-staff";
import { StaffInvitation } from "../domain/staff-invitation";

const tags = ["Stores"];

const createStore = createDefaultRoute({
  method: "post",
  path: "/",
  tags,
  operationId: "createStore",
  description: "Create a new store",
  security: [
    {
      session: [],
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            id: z.string().describe("Unique identifier for the store"),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: Store,
        },
      },
      description: "Create store response",
    },
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

const fetchStoresForStaff = createDefaultRoute({
  method: "get",
  path: "/me/stores",
  tags,
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

const inviteStaffToStore = createDefaultRoute({
  method: "post",
  path: "/:storeId/invite",
  tags,
  operationId: "inviteStaffToStore",
  description: "Invite a staff member to a store",
  security: [
    {
      session: [],
    },
  ],
  request: {
    params: z.object({
      storeId: z.string().describe("ID of the store to invite staff to"),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            email: z
              .string()
              .email()
              .describe("Email of the staff member to invite"),
            role: StaffRole,
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Staff invitation sent successfully",
      content: {
        "application/json": {
          schema: StaffInvitation,
        },
      },
    },
  },
});

export default {
  createStore,
  fetchStoresForStaff,
  inviteStaffToStore,
};
