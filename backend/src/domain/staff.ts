import { staffs } from '../db/schema/stores';
import { FieldErrors, ForUpdate } from './shared/types';
import z from 'zod';
import { Timestamp } from './timestamp';
import { Uid } from './auth';
import { errorBuilder, InferError } from '../shared/error';
import { User } from './user';
import { err, ok, Result } from 'neverthrow';

export type DBStaff = typeof staffs.$inferSelect;
export type DBStaffForCreate = typeof staffs.$inferInsert;
export type DBStaffForUpdate = ForUpdate<DBStaff>;

export const StaffId = z.string().min(1).brand<"STAFF_ID">();
export type StaffId = z.infer<typeof StaffId>;

export const Staff = z
  .object({
    id: StaffId,
    userId: Uid,
    createdAt: Timestamp,
    updatedAt: Timestamp,
  })
  .brand<"STAFF">()
  .openapi({ ref: "Staff" });
export type Staff = z.infer<typeof Staff>;

export const InvalidStaffError = errorBuilder<
  "InvalidStaffError",
  FieldErrors<typeof User>
>("InvalidStaffError");
export type InvalidStaffError = InferError<typeof InvalidStaffError>;

export const validateStaff = (staff: DBStaff): Result<Staff, InvalidStaffError> => {
  const res = Staff.safeParse({
    id: staff.id as StaffId,
    userId: staff.userId as Uid,
    createdAt: Timestamp.parse(staff.createdAt),
    updatedAt: Timestamp.parse(staff.updatedAt),
  });

  if (res.success) return ok(res.data);

  return err(
    InvalidStaffError("Invalid staff data", {
      cause: res.error,
      extra: res.error.flatten().fieldErrors,
    })
  );
}