import { createDefaultRoute } from "./shared/default-route";
import { z } from "zod";
import { StaffInvitation } from "../domain/staff-invitation";
import { StaffRole } from "../domain/store-staff";

const tags = ["Invitations"];

const inviteStaffToStore = createDefaultRoute({
  method: "post",
  path: "/{storeId}/invite",
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

const acceptInvitation = createDefaultRoute({
  method: "post",
  path: "/accept",
  tags,
  operationId: "acceptInvitation",
  description: "Accept a staff invitation",
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
            token: z.string().describe("Unique token for the invitation"),
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

const declineInvitation = createDefaultRoute({
  method: "post",
  path: "/decline",
  tags,
  operationId: "declineInvitation",
  description: "Decline a staff invitation",
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
            token: z.string().describe("Unique token for the invitation"),
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
  inviteStaffToStore,
  acceptInvitation,
  declineInvitation,
};
