import { customers } from "../db/schema/customers";
import z from "zod";
import { Timestamp, toTimestamp } from "./timestamp";
import { errorBuilder, InferError } from "../shared/error";
import { FieldErrors } from "./shared/types";
import { Result, ok, err } from "neverthrow";

export type DBCustomer = typeof customers.$inferSelect;
export type DBCustomerForCreate = typeof customers.$inferInsert;

export const CustomerId = z.string().brand<"CUSTOMER_ID">();
export type CustomerId = z.infer<typeof CustomerId>;

export const Customer = z
  .object({
    id: CustomerId,
    createdAt: Timestamp,
    updatedAt: Timestamp,
  })
  .brand<"CUSTOMER">()
  .openapi("Customer");
  export type Customer = z.infer<typeof Customer>;

export const InvalidCustomerError = errorBuilder<
    "InvalidCustomerError",
    FieldErrors<typeof Customer>
>("InvalidCustomerError");
export type InvalidCustomerError = InferError<typeof InvalidCustomerError>;

export type ValidateCustomer = (
  customer: DBCustomer
) => Result<Customer, InvalidCustomerError>;
export const validateCustomer: ValidateCustomer = (
  customer: DBCustomer
): Result<Customer, InvalidCustomerError> => {
  const res = Customer.safeParse({
    id: customer.id as CustomerId,
    createdAt: toTimestamp(customer.createdAt),
    updatedAt: toTimestamp(customer.updatedAt),
  });

  if (res.success) return ok(res.data);

  return err(
    InvalidCustomerError("Invalid customer data", {
      cause: res.error,
      extra: res.error.flatten().fieldErrors,
    })
  );
};

