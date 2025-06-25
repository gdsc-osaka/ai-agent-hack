import { err, ok, ResultAsync } from "neverthrow";
import {
  DBCustomer,
  DBCustomerForCreate,
  DBCustomerForUpdate,
} from "../domain/customer";
import { eq } from "drizzle-orm";
import { customers } from "../db/schema/app/customers";
import { DBorTx } from "../db/db";
import { DBInternalError } from "./shared/db-error";
import {
  CustomerAlreadyExistsError,
  CustomerNotFoundError,
} from "./customer-repo.error";

export type InserttDBCustomer = (
  db: DBorTx
) => (
  customer: DBCustomerForCreate
) => ResultAsync<DBCustomer, DBInternalError | CustomerAlreadyExistsError>;

export const insertDBCustomer: InserttDBCustomer = (db) => (customer) =>
  ResultAsync.fromPromise(
    db.insert(customers).values(customer).returning(),
    DBInternalError.handle
  ).andThen((records) =>
    records.length > 0
      ? ok(records[0])
      : err(CustomerAlreadyExistsError("Customer already exists"))
  );

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

// ADDED: Function to update a customer record
export type UpdateDBCustomer = (
  db: DBorTx
) => (
  customer: DBCustomerForUpdate
) => ResultAsync<DBCustomer, DBInternalError | CustomerNotFoundError>;

export const updateDBCustomer: UpdateDBCustomer = (db) => (customer) =>
  ResultAsync.fromPromise(
    db
      .update(customers)
      .set(customer)
      .where(eq(customers.id, customer.id))
      .returning(),
    DBInternalError.handle
  ).andThen((records) =>
    records.length > 0
      ? ok(records[0])
      : err(CustomerNotFoundError("Customer not found during update"))
  );

export type DeleteDBCustomerById = (
  db: DBorTx
) => (id: string) => ResultAsync<void, DBInternalError | CustomerNotFoundError>;

export const deleteDBCustomerById: DeleteDBCustomerById = (db) => (id) =>
  ResultAsync.fromPromise(
    db
      .delete(customers)
      .where(eq(customers.id, id))
      .returning({ id: customers.id }),
    DBInternalError.handle
  ).andThen((deletedRecords) =>
    deletedRecords.length > 0
      ? ok(undefined)
      : err(CustomerNotFoundError("Customer not found during delete"))
  );
