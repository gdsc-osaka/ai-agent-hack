import { customers } from "../db/schema/customers";
import z from "zod";

export type DBCustomer = typeof customers.$inferSelect;
export type DBCustomerForCreate = typeof customers.$inferInsert;

export const CustomerId = z.string().brand<"CUSTOMER_ID">();
export type CustomerId = z.infer<typeof CustomerId>;
