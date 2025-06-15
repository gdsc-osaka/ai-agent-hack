import * as users from "./schema/users";
import * as stores from "./schema/stores";
import * as auth from "./schema/auth";

export const authSchema = auth;

export default {
  ...users,
  ...stores,
};
