import { createDefaultRoute } from "./shared/default-route";
import { z } from "zod";
import { StaffInvitation } from "../domain/staff-invitation";
import tags from "./shared/tags";

const acceptInvitation = createDefaultRoute({
  method: "post",
  path: "/accept",
  tags: tags.invitations,
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
  tags: tags.invitations,
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
  acceptInvitation,
  declineInvitation,
};
