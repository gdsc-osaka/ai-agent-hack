import * as users from "./schema/users";
import * as auth from "./schema/auth";

export const authSchema = auth;

export default {
  ...users,
};
