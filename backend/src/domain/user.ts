import { users } from "../db/schema/users";
import z from "zod";
import "zod-openapi/extend";
import { Result } from "neverthrow";
import { Timestamp, toTimestamp } from "./timestamp";
import { ForUpdate } from "./shared/types";
import { Uid } from "./auth";

const UserId = z.string().brand("UserId");
type UserId = z.infer<typeof UserId>;

export const User = z
  .object({
    id: UserId,
    uid: Uid,
    createdAt: Timestamp,
    updatedAt: Timestamp,
  })
  .openapi({ ref: "User" });
export type User = z.infer<typeof User>;

export type DBUser = typeof users.$inferSelect;
export type DBUserForCreate = typeof users.$inferInsert;
export type DBUserForUpdate = ForUpdate<DBUser>;

export const convertToUser = (user: DBUser): Result<User, never> => {
  // TODO: validate user with zod

  return Result.combine([
    toTimestamp(user.createdAt),
    toTimestamp(user.updatedAt),
  ]).map(([createdAt, updatedAt]) => ({
    id: user.id as UserId,
    uid: user.uid as Uid,
    createdAt,
    updatedAt,
  }));
};
