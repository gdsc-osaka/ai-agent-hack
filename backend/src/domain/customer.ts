import { customers } from "../db/schema/customers";

export type DBCustomer = typeof customers.$inferSelect;
export type DBCustomerForCreate = typeof customers.$inferInsert;
