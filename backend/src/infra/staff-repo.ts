import { DBorTx } from "../db/db";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { DBStaff, DBStaffForCreate } from "../domain/staff";
import { DBInternalError } from "./shared/db-error";
import {
  DBStaffAlreadyExistsError,
  DBStaffNotFoundError,
} from "./staff-repo.error";
import { staffs } from "../db/schema/stores";
import { eq } from "drizzle-orm";
import { Uid } from "../domain/auth";

export type FetchDBStaffByUserId = (
  db: DBorTx
) => (
  userId: Uid
) => ResultAsync<DBStaff, DBInternalError | DBStaffNotFoundError>;

export const fetchDBStaffByUserId: FetchDBStaffByUserId = (db) => (userId) =>
  ResultAsync.fromPromise(
    db.select().from(staffs).where(eq(staffs.userId, userId)).limit(1),
    DBInternalError.handle
  ).andThen((records) =>
    records.length > 0
      ? okAsync(records[0])
      : errAsync(DBStaffNotFoundError("Staff not found", { extra: { userId } }))
  );

export type InsertDBStaff = (
  db: DBorTx
) => (
  staff: DBStaffForCreate
) => ResultAsync<DBStaff, DBInternalError | DBStaffAlreadyExistsError>;

export const insertDBStaff: InsertDBStaff = (db) => (staff) =>
  ResultAsync.fromPromise(
    db.insert(staffs).values(staff).returning(),
    DBInternalError.handle
  ).andThen((records) =>
    records.length > 0
      ? okAsync(records[0])
      : errAsync(DBStaffAlreadyExistsError("Staff already exists"))
  );
