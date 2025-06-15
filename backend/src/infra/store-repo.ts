import { DBorTx } from "../db/db";
import { err, ok, ResultAsync } from "neverthrow";
import { DBStore, DBStoreForCreate } from "../domain/store";
import { DBInternalError } from "./shared/db-error";
import { DBStoreAlreadyExistsError } from "./store-repo.error";
import { stores } from "../db/schema/stores";

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
