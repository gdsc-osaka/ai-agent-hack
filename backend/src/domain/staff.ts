import { staffs } from "../db/schema/stores";
import { FieldErrors, ForUpdate } from "./shared/types";
import z from "zod";
import { Timestamp, toTimestamp } from "./timestamp";
import { Uid } from "./auth";
import { errorBuilder, InferError } from "../shared/error";
import { err, ok, Result } from "neverthrow";
import { User } from "better-auth";
import "zod-openapi/extend";

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
  FieldErrors<typeof Staff>
>("InvalidStaffError");
export type InvalidStaffError = InferError<typeof InvalidStaffError>;

export type ValidateStaff = (
  staff: DBStaff
) => Result<Staff, InvalidStaffError>;
export const validateStaff: ValidateStaff = (
  staff: DBStaff
): Result<Staff, InvalidStaffError> => {
  const res = Staff.safeParse({
    id: staff.id as StaffId,
    userId: staff.userId as Uid,
    createdAt: toTimestamp(staff.createdAt),
    updatedAt: toTimestamp(staff.updatedAt),
  });

  if (res.success) return ok(res.data);

  return err(
    InvalidStaffError("Invalid staff data", {
      cause: res.error,
      extra: res.error.flatten().fieldErrors,
    })
  );
};

export type ValidateStaffs = (
  staffs: DBStaff[]
) => Result<Staff[], InvalidStaffError>;
export const validateStaffs: ValidateStaffs = (
  staffs: DBStaff[]
): Result<Staff[], InvalidStaffError> =>
  Result.combine(staffs.map(validateStaff));

export const CreateNewStaffError = errorBuilder(
  "CreateNewStaffError",
  z.object({
    user: z.custom<User>(),
  })
);
export type CreateNewStaffError = InferError<typeof CreateNewStaffError>;

export type CreateNewStaff = (
  user: User
) => Result<DBStaffForCreate, CreateNewStaffError>;

export const createNewStaff: CreateNewStaff = (
  user: User
): Result<DBStaffForCreate, CreateNewStaffError> => {
  if (typeof user.id !== "string" || user.id.length === 0) {
    return err(
      CreateNewStaffError(
        `User id must be string type and not empty, but got ${user.id}`,
        {
          extra: { user },
        }
      )
    );
  }

  return ok({
    userId: user.id,
  });
};
