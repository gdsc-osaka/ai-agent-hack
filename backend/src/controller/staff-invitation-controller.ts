import {
  AcceptStaffInvitation,
  DeclineStaffInvitation,
  InviteStaffToStore,
} from "../service/staff-invitation-service";
import { ResultAsync } from "neverthrow";
import {
  CreateStaffInvitationPermissionError,
  DuplicateStaffInvitationError,
  InvalidStaffInvitationError,
  StaffInvitation,
  StaffInvitationExpiredError,
  StaffInvitationNotPendingError,
  StaffInvitationWrongEmailError,
} from "../domain/staff-invitation";
import { HTTPErrorCarrier, StatusCode } from "./error/api-error";
import { match, P } from "ts-pattern";
import { DBStaffNotFoundError } from "../infra/staff-repo.error";
import { DBStoreNotFoundError } from "../infra/store-repo.error";
import { InvalidStaffRoleError } from "../domain/store-staff";
import { DBInternalError } from "../infra/shared/db-error";
import {
  DBStaffInvitationAlreadyExistsError,
  DBStaffInvitationNotFoundError,
} from "../infra/staff-invitation-repo.error";
import { DBStoreToStaffAlreadyExistsError } from "../infra/store-to-staff-repo.error";

export const inviteStaffToStoreController = (
  inviteStaffToStoreRes: ReturnType<InviteStaffToStore>
): ResultAsync<StaffInvitation, HTTPErrorCarrier> =>
  inviteStaffToStoreRes.mapErr((err) =>
    match(err)
      .with(
        P.union(
          DBStaffNotFoundError.is,
          DBStoreNotFoundError.is,
          DBStoreNotFoundError.is,
          DBStaffInvitationAlreadyExistsError.is,
          DuplicateStaffInvitationError.is
        ),
        (err) =>
          HTTPErrorCarrier(StatusCode.BadRequest, {
            message: err.message,
            code: "DATABASE_NOT_FOUND",
            details: [err.cause, err.extra],
          })
      )
      .with(CreateStaffInvitationPermissionError.is, (err) =>
        HTTPErrorCarrier(StatusCode.Forbidden, {
          message: err.message,
          code: "PERMISSION_DENIED",
          details: [err.cause, err.extra],
        })
      )
      .with(
        P.union(InvalidStaffInvitationError.is, InvalidStaffRoleError.is),
        (err) =>
          HTTPErrorCarrier(StatusCode.InternalServerError, {
            message: err.message,
            code: "DATABASE_INCONSISTENT_TYPE",
            details: [err.cause, err.extra],
          })
      )
      .with(DBInternalError.is, (err) =>
        HTTPErrorCarrier(StatusCode.InternalServerError, {
          message: err.message,
          code: "DATABASE_UNKNOWN_ERROR",
          details: [err.cause, err.extra],
        })
      )
      .exhaustive()
  );

export const acceptStaffInvitationController = (
  res: ReturnType<AcceptStaffInvitation>
): ResultAsync<StaffInvitation, HTTPErrorCarrier> =>
  res.mapErr((err) =>
    match(err)
      .with(DBInternalError.is, (err) =>
        HTTPErrorCarrier(StatusCode.InternalServerError, {
          message: err.message,
          code: "DATABASE_UNKNOWN_ERROR",
          details: [err.cause, err.extra],
        })
      )
      .with(DBStaffNotFoundError.is, (err) =>
        HTTPErrorCarrier(StatusCode.NotFound, {
          message: err.message,
          code: "STAFF_NOT_FOUND",
          details: [err.cause, err.extra],
        })
      )
      .with(DBStoreNotFoundError.is, (err) =>
        HTTPErrorCarrier(StatusCode.NotFound, {
          message: err.message,
          code: "STORE_NOT_FOUND",
          details: [err.cause, err.extra],
        })
      )
      .with(DBStaffInvitationNotFoundError.is, (err) =>
        HTTPErrorCarrier(StatusCode.NotFound, {
          message: err.message,
          code: "STAFF_INVITATION_NOT_FOUND",
          details: [err.cause, err.extra],
        })
      )
      .with(DBStoreToStaffAlreadyExistsError.is, (err) =>
        HTTPErrorCarrier(StatusCode.Conflict, {
          message: err.message,
          code: "STORE_TO_STAFF_ALREADY_EXISTS",
          details: [err.cause, err.extra],
        })
      )
      .with(StaffInvitationExpiredError.is, (err) =>
        HTTPErrorCarrier(StatusCode.BadRequest, {
          message: err.message,
          code: "STAFF_INVITATION_EXPIRED",
          details: [err.cause, err.extra],
        })
      )
      .with(StaffInvitationNotPendingError.is, (err) =>
        HTTPErrorCarrier(StatusCode.BadRequest, {
          message: err.message,
          code: "STAFF_INVITATION_NOT_PENDING",
          details: [err.cause, err.extra],
        })
      )
      .with(StaffInvitationWrongEmailError.is, (err) =>
        HTTPErrorCarrier(StatusCode.BadRequest, {
          message: err.message,
          code: "STAFF_INVITATION_WRONG_EMAIL",
          details: [err.cause, err.extra],
        })
      )
      .with(InvalidStaffInvitationError.is, (err) =>
        HTTPErrorCarrier(StatusCode.InternalServerError, {
          message: err.message,
          code: "DATABASE_INCONSISTENT_TYPE",
          details: [err.cause, err.extra],
        })
      )
      .exhaustive()
  );

export const declineStaffInvitationController = (
  res: ReturnType<DeclineStaffInvitation>
): ResultAsync<StaffInvitation, HTTPErrorCarrier> =>
  res.mapErr((err) =>
    match(err)
      .with(DBInternalError.is, (err) =>
        HTTPErrorCarrier(StatusCode.InternalServerError, {
          message: err.message,
          code: "DATABASE_UNKNOWN_ERROR",
          details: [err.cause, err.extra],
        })
      )
      .with(DBStaffInvitationNotFoundError.is, (err) =>
        HTTPErrorCarrier(StatusCode.NotFound, {
          message: err.message,
          code: "STAFF_INVITATION_NOT_FOUND",
          details: [err.cause, err.extra],
        })
      )
      .with(DBStaffNotFoundError.is, (err) =>
        HTTPErrorCarrier(StatusCode.NotFound, {
          message: err.message,
          code: "STAFF_NOT_FOUND",
          details: [err.cause, err.extra],
        })
      )
      .with(StaffInvitationExpiredError.is, (err) =>
        HTTPErrorCarrier(StatusCode.BadRequest, {
          message: err.message,
          code: "STAFF_INVITATION_EXPIRED",
          details: [err.cause, err.extra],
        })
      )
      .with(StaffInvitationNotPendingError.is, (err) =>
        HTTPErrorCarrier(StatusCode.BadRequest, {
          message: err.message,
          code: "STAFF_INVITATION_NOT_PENDING",
          details: [err.cause, err.extra],
        })
      )
      .with(StaffInvitationWrongEmailError.is, (err) =>
        HTTPErrorCarrier(StatusCode.BadRequest, {
          message: err.message,
          code: "STAFF_INVITATION_WRONG_EMAIL",
          details: [err.cause, err.extra],
        })
      )
      .with(InvalidStaffInvitationError.is, (err) =>
        HTTPErrorCarrier(StatusCode.InternalServerError, {
          message: err.message,
          code: "DATABASE_INCONSISTENT_TYPE",
          details: [err.cause, err.extra],
        })
      )
      .exhaustive()
  );
