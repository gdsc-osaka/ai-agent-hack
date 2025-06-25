import { DBVisit, DBVisitForCreate } from "../domain/visit";
import { DBorTx } from "../db/db";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { DBInternalError } from "./shared/db-error";
import { visits } from "../db/schema/app/visits";
import { eq } from "drizzle-orm";
import { StoreId } from "../domain/store";

// Errors
// export const DBVisitAlreadyExistsError = errorBuilder('DBVisitAlreadyExistsError');
// export type DBVisitAlreadyExistsError = InferError<typeof DBVisitAlreadyExistsError>;

export type InsertDBVisit = (
  db: DBorTx
) => (visit: DBVisitForCreate) => ResultAsync<DBVisit, DBInternalError>;

export const insertDBVisit: InsertDBVisit = (db) => (visit) =>
  ResultAsync.fromPromise(
    db.insert(visits).values(visit).returning(),
    DBInternalError.handle
  ).andThen((records) =>
    records.length > 0
      ? okAsync(records[0])
      : errAsync(DBInternalError("Unexpected error: no records returned"))
  );

export type FetchDBVisitByStoreId = (
  db: DBorTx
) => (storeId: StoreId) => ResultAsync<DBVisit[], DBInternalError>;

export const fetchDBVisitByStoreId: FetchDBVisitByStoreId = (db) => (storeId) =>
  ResultAsync.fromPromise(
    db.select().from(visits).where(eq(visits.storeId, storeId)),
    DBInternalError.handle
  ).andThen((records) =>
    records.length > 0
      ? okAsync(records)
      : errAsync(DBInternalError("No visits found for the store"))
  );
