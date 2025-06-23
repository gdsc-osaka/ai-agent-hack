import { AuthUser } from "../domain/auth";
import db from "../db/db";
import { Result, ResultAsync } from "neverthrow";
import { FetchDBStoreByPublicId } from "../infra/store-repo";
import { RunTransaction } from "../infra/transaction";
import {
  validateStaffRole,
  InvalidStaffRoleError,
} from "../domain/store-staff";
import { FetchDBStaffForStoreById } from "../infra/staff-repo";
import {
  validateStaffForStore,
  InvalidStaffForStoreError,
} from "../domain/staff";
import { InvalidStoreError, validateStore } from "../domain/store";
import {
  checkDuplicateStaffInvitation,
  createStaffInvitation,
  CreateStaffInvitationPermissionError,
  DuplicateStaffInvitationError,
  InvalidStaffInvitationError,
  StaffInvitation,
  validateStaffInvitation,
} from "../domain/staff-invitation";
import {
  FetchDBStaffInvitationByEmailAndPending,
  InsertDBStaffInvitation,
} from "../infra/staff-invitation-repo";
import { DBInternalError } from "../infra/shared/db-error";
import { DBStaffNotFoundError } from "../infra/staff-repo.error";
import { DBStoreNotFoundError } from "../infra/store-repo.error";
import { DBStaffInvitationAlreadyExistsError } from "../infra/staff-invitation-repo.error";

export type InviteStaffToStore = (
  authUser: AuthUser,
  storeId: string,
  targetEmail: string,
  targetRole: string
) => ResultAsync<
  StaffInvitation,
  | DBInternalError
  | DBStaffNotFoundError
  | DBStoreNotFoundError
  | DBStaffInvitationAlreadyExistsError
  | DuplicateStaffInvitationError
  | CreateStaffInvitationPermissionError
  | InvalidStaffInvitationError
  | InvalidStoreError
  | InvalidStaffRoleError
  | InvalidStaffForStoreError
>;

export const inviteStaffToStore =
  (
    runTransaction: RunTransaction,
    fetchDBStaffForStoreById: FetchDBStaffForStoreById,
    fetchDBStoreByPublicId: FetchDBStoreByPublicId,
    fetchDBStaffInvitationByEmailAndPending: FetchDBStaffInvitationByEmailAndPending,
    insertDBStaffInvitation: InsertDBStaffInvitation
  ): InviteStaffToStore =>
  (
    authUser: AuthUser,
    storeId: string,
    targetEmail: string,
    targetRole: string
  ) =>
    runTransaction(db)((tx) =>
      ResultAsync.combine([
        fetchDBStaffForStoreById(tx)(authUser.uid),
        fetchDBStoreByPublicId(tx)(storeId),
        checkDuplicateStaffInvitation(
          fetchDBStaffInvitationByEmailAndPending(tx)(storeId, targetEmail)
        ),
      ])
        .andThen(([dbStaff, dbStore]) =>
          Result.combine([
            validateStaffForStore(dbStaff),
            validateStore(dbStore),
            validateStaffRole(targetRole),
          ])
        )
        .andThen(([staff, store, targetRole]) =>
          createStaffInvitation(store.id, staff, targetEmail, targetRole)
        )
        .andThen(insertDBStaffInvitation(tx))
        .andThen(validateStaffInvitation)
    );
