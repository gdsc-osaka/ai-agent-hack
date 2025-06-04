import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { users } from "../db/schema/users";
import { eq } from "drizzle-orm";
import type { DBorTx } from "../db/db";
import { DBUser } from "../domain/user";
import { infraLogger } from "../logger";
import { DBUserNotFoundError } from "./user-repo.error";
import { DBInternalError } from "./shared/db-error";

export type FetchDBUserByUid = (
  db: DBorTx,
) => (
  uid: string,
) => ResultAsync<DBUser, DBInternalError | DBUserNotFoundError>;

export const fetchDBUserByUid: FetchDBUserByUid = (db) => (uid) =>
  ResultAsync.fromPromise(
    db.select().from(users).where(eq(users.uid, uid)).limit(1).execute(),
    DBUserNotFoundError.handle,
  )
    .andThen((records) =>
      records.length > 0
        ? okAsync(records[0])
        : errAsync(DBUserNotFoundError("User not found", { extra: { uid } })),
    )
    .orTee(infraLogger("fetchDBUserByUid").error);
