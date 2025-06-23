import { err, ok, ResultAsync } from "neverthrow";
import { DBCustomer, DBCustomerForCreate } from "../domain/customer";
import { eq } from "drizzle-orm";
import { customers } from "../db/schema/customers";
import { DBorTx } from "../db/db";
import { DBInternalError } from "./shared/db-error";
import {
  CustomerAlreadyExistsError,
  CustomerNotFoundError,
} from "./customer-repo.error";

export type CreatetDBCustomer = (
  db: DBorTx
) => (
  customer: DBCustomerForCreate
) => ResultAsync<DBCustomer, DBInternalError | CustomerAlreadyExistsError>;

export type FindDBCustomerById = (
  db: DBorTx
) => (
  id: string
) => ResultAsync<DBCustomer, DBInternalError | CustomerNotFoundError>;

export const findDBCustomerById: FindDBCustomerById = (db) => (id) =>
  ResultAsync.fromPromise(
    db.select().from(customers).where(eq(customers.id, id)).limit(1),
    DBInternalError.handle
  ).andThen((records) =>
    records.length > 0
      ? ok(records[0])
      : err(CustomerNotFoundError("Customer not found"))
  );

export const createDBCustomer: CreatetDBCustomer = (db) => (customer) =>
  ResultAsync.fromPromise(
    db.insert(customers).values(customer).returning(),
    DBInternalError.handle
  ).andThen((records) =>
    records.length > 0
      ? ok(records[0])
      : err(CustomerAlreadyExistsError("Customer already exists"))
  );
