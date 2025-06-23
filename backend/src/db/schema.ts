import * as stores from "./schema/stores";
import * as staffInvitations from "./schema/staff-invitations";
import * as customers from "./schema/customers";
import * as profiles from "./schema/profiles";
import * as auth from "./schema/auth";

export const authSchema = auth;

export default {
  ...stores,
  ...staffInvitations,
  ...customers,
  ...profiles,
};
