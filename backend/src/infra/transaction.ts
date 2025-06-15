import { DB, Transaction } from "../db/db";
import { ResultAsync } from "neverthrow";

export type RunTransaction = (
  db: DB
) => <T, E>(
  operation: (tx: Transaction) => ResultAsync<T, E>
) => ResultAsync<T, E>;

export const runTransaction: RunTransaction = (db) => (operation) =>
  ResultAsync.fromSafePromise(
    db.transaction(async (tx) => await operation(tx))
  ).andThen((res) => res);
