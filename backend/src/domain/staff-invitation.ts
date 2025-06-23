import { staffInvitations } from "../db/schema/staff-invitations";
import { z } from "@hono/zod-openapi";
import { StaffRole } from "./store-staff";
import { StoreId } from "./store";
import { StaffForStore, StaffId } from "./staff";
import { Timestamp, toTimestamp } from "./timestamp";
import { err, errAsync, ok, okAsync, Result, ResultAsync } from "neverthrow";
import { errorBuilder, InferError } from "../shared/error";
import { FieldErrors } from "./shared/types";
import { FetchDBStaffInvitationByEmailAndPending } from "../infra/staff-invitation-repo";
import { ReturnType2 } from "../shared/types";
import { match } from "ts-pattern";
import { DBStaffInvitationNotFoundError } from "../infra/staff-invitation-repo.error";
import { DBInternalError } from "../infra/shared/db-error";

export type DBStaffInvitation = typeof staffInvitations.$inferSelect;
export type DBStaffInvitationForCreate = typeof staffInvitations.$inferInsert;

export const StaffInvitationStatus = z
  .enum(["PENDING", "ACCEPTED", "DECLINED", "EXPIRED"])
  .openapi("StaffInvitationStatus");
export type StaffInvitationStatus = z.infer<typeof StaffInvitationStatus>;

export const StaffInvitation = z
  .object({
    status: StaffInvitationStatus,
    role: StaffRole,
    storeId: StoreId,
    targetEmail: z
      .string()
      .email()
      .describe("Email of the staff member to invite"),
    invitedBy: StaffId,
    token: z.string().describe("Unique token for the invitation"),
    expiredAt: Timestamp,
    createdAt: Timestamp,
    updatedAt: Timestamp,
  })
  .openapi("StaffInvitation");
export type StaffInvitation = z.infer<typeof StaffInvitation>;

export const CreateStaffInvitationPermissionError = errorBuilder(
  "CreateStaffInvitationPermissionError"
);
export type CreateStaffInvitationPermissionError = InferError<
  typeof CreateStaffInvitationPermissionError
>;

export type CreateStaffInvitation = (
  storeId: StoreId,
  invitedStaff: StaffForStore,
  targetEmail: string,
  targetRole: StaffRole
) => Result<DBStaffInvitationForCreate, CreateStaffInvitationPermissionError>;
export const createStaffInvitation: CreateStaffInvitation = (
  storeId: StoreId,
  invitedStaff: StaffForStore,
  targetEmail: string,
  targetRole: StaffRole
) => {
  if (invitedStaff.role !== "ADMIN") {
    return err(
      CreateStaffInvitationPermissionError(
        "Only admin staff can create invitations"
      )
    );
  }

  const oneWeekLater = new Date();
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);

  return ok({
    status: "PENDING",
    role: targetRole,
    storeId,
    targetEmail: targetEmail,
    invitedBy: invitedStaff.id,
    token: crypto.randomUUID(),
    expiredAt: oneWeekLater,
  } satisfies DBStaffInvitationForCreate);
};

// duplicate invitation error and its function
export const DuplicateStaffInvitationError = errorBuilder(
  "DuplicateStaffInvitationError",
  z.object({
    invitationId: z.string(),
  })
);
export type DuplicateStaffInvitationError = InferError<
  typeof DuplicateStaffInvitationError
>;

export type CheckDuplicateStaffInvitation = (
  res: ReturnType2<FetchDBStaffInvitationByEmailAndPending>
) => ResultAsync<void, DuplicateStaffInvitationError | DBInternalError>;
export const checkDuplicateStaffInvitation: CheckDuplicateStaffInvitation = (
  res: ReturnType2<FetchDBStaffInvitationByEmailAndPending>
): ResultAsync<void, DuplicateStaffInvitationError | DBInternalError> => {
  return res
    .andThen((inv) =>
      errAsync(
        DuplicateStaffInvitationError("Staff invitation already exists", {
          extra: { invitationId: inv.id },
        })
      )
    )
    .orElse((err) =>
      match(err)
        .with(DBStaffInvitationNotFoundError.is, () => okAsync(undefined))
        .with(DBInternalError.is, (err) => errAsync(err))
        .with(DuplicateStaffInvitationError.is, (err) => errAsync(err))
        .exhaustive()
    );
};

export const InvalidStaffInvitationError = errorBuilder<
  "InvalidStaffInvitationError",
  FieldErrors<typeof StaffInvitation>
>("InvalidStaffInvitationError");
export type InvalidStaffInvitationError = InferError<
  typeof InvalidStaffInvitationError
>;

export type ValidateStaffInvitation = (
  staffInvitation: DBStaffInvitation
) => Result<StaffInvitation, InvalidStaffInvitationError>;
export const validateStaffInvitation: ValidateStaffInvitation = (
  staffInvitation: DBStaffInvitation
): Result<StaffInvitation, InvalidStaffInvitationError> => {
  const res = StaffInvitation.safeParse({
    status: staffInvitation.status,
    role: staffInvitation.role,
    storeId: staffInvitation.storeId as StoreId,
    targetEmail: staffInvitation.targetEmail,
    invitedBy: staffInvitation.invitedBy as StaffId,
    token: staffInvitation.token,
    expiredAt: toTimestamp(staffInvitation.expiredAt),
    createdAt: toTimestamp(staffInvitation.createdAt),
    updatedAt: toTimestamp(staffInvitation.updatedAt),
  } satisfies StaffInvitation);

  if (res.success) return ok(res.data);

  return err(
    InvalidStaffInvitationError("Invalid staff invitation data", {
      cause: res.error,
      extra: res.error.flatten().fieldErrors,
    })
  );
};
