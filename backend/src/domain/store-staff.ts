import { storesToStaffs } from "../db/schema/stores";
import { Staff } from "./staff";
import { Store } from "./store";
import { ok, Result } from "neverthrow";

export type DBStoreToStaff = typeof storesToStaffs.$inferSelect;
export type DBStoreToStaffForCreate = typeof storesToStaffs.$inferInsert;

export type AssignAdminStaffToStore = (
  store: Store,
  staff: Staff
) => Result<DBStoreToStaff, never>;
export const assignAdminStaffToStore: AssignAdminStaffToStore = (
  store: Store,
  staff: Staff
): Result<DBStoreToStaffForCreate, never> => {
  return ok({
    storeId: store.id,
    staffId: staff.id,
    role: "ADMIN",
  });
};
