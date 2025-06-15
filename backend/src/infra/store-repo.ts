import { DBorTx } from "../db/db";
import { err, ok, ResultAsync } from "neverthrow";
import { DBStore, DBStoreForCreate } from "../domain/store";
import { DBInternalError } from "./shared/db-error";
import { DBStoreAlreadyExistsError } from "./store-repo.error";
import { staffs, stores } from "../db/schema/stores";
import { StaffId } from "../domain/staff";
import { eq } from "drizzle-orm";

export type InsertDBStore = (
  db: DBorTx
) => (
  store: DBStoreForCreate
) => ResultAsync<DBStore, DBInternalError | DBStoreAlreadyExistsError>;

export const insertDBStore: InsertDBStore = (db) => (store) =>
  ResultAsync.fromPromise(
    db.insert(stores).values(store).returning(),
    DBInternalError.handle
  ).andThen((records) =>
    records.length > 0
      ? ok(records[0])
      : err(
          DBStoreAlreadyExistsError("Store already exists", {
            extra: { publicId: store.publicId },
          })
        )
  );

export type FetchDBStoresForStaff = (
  db: DBorTx
) => (staffId: StaffId) => ResultAsync<DBStore[], DBInternalError>;

export const fetchDBStoresForStaff: FetchDBStoresForStaff =
  (db: DBorTx) => (staffId: StaffId) =>
    ResultAsync.fromPromise(
      db.query.staffs.findMany({
        columns: {
          id: true,
        },
        with: {
          storesToStaffs: {
            with: {
              store: true,
            },
          },
        },
        where: eq(staffs.id, staffId),
      }),
      DBInternalError.handle
    ).map((records) =>
      records
        .map((record) =>
          record.storesToStaffs.map((storeToStaff) => storeToStaff.store)
        )
        .flat()
    );
