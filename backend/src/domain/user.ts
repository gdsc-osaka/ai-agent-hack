import { users } from "../db/schema/users";
import z from "zod";
import "zod-openapi/extend";
import { err, ok, Result } from "neverthrow";
import { Timestamp, toTimestamp } from "./timestamp";
import { FieldErrors, ForUpdate, OmitBrand } from "./shared/types";
import { Uid } from "./auth";
import { errorBuilder, InferError } from "../shared/error";

export const UserId = z.string().brand<"USER_ID">();
export type UserId = z.infer<typeof UserId>;

export const User = z
  .object({
    id: UserId,
    uid: Uid,
    createdAt: Timestamp,
    updatedAt: Timestamp,
  })
  .brand<"USER">()
  .openapi({ ref: "User" });
export type User = z.infer<typeof User>;

export type DBUser = typeof users.$inferSelect;
export type DBUserForCreate = typeof users.$inferInsert;
export type DBUserForUpdate = ForUpdate<DBUser>;

export const InvalidUserError = errorBuilder<
  "InvalidUserError",
  FieldErrors<typeof User>
>("InvalidUserError");
export type InvalidUserError = InferError<typeof InvalidUserError>;

export const validateUser = (user: DBUser): Result<User, InvalidUserError> => {
  const res = User.safeParse({
    id: user.id as UserId,
    uid: user.uid as Uid,
    createdAt: toTimestamp(user.createdAt),
    updatedAt: toTimestamp(user.updatedAt),
  } satisfies OmitBrand<User>);

  if (res.success) return ok(res.data);

  return err(
    InvalidUserError("Invalid user data", {
      cause: res.error,
      extra: res.error.flatten().fieldErrors,
    })
  );
};
