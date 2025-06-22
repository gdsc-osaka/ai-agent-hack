import { InviteStaffToStore } from '../service/staff-invitation-service';
import { ResultAsync } from 'neverthrow';
import {
  CreateStaffInvitationPermissionError,
  DuplicateStaffInvitationError,
  InvalidStaffInvitationError,
  StaffInvitation,
} from '../domain/staff-invitation';
import { HTTPErrorCarrier, StatusCode } from './error/api-error';
import { match, P } from 'ts-pattern';
import { DBStaffNotFoundError } from '../infra/staff-repo.error';
import { DBStoreNotFoundError } from '../infra/store-repo.error';
import { InvalidStoreError } from '../domain/store';
import { InvalidStaffRoleError } from '../domain/store-staff';
import { InvalidStaffForStoreError } from '../domain/staff';
import { DBInternalError } from '../infra/shared/db-error';
import { DBStaffInvitationAlreadyExistsError } from '../infra/staff-invitation-repo.error';

export const inviteStaffToStoreController = (
  inviteStaffToStoreRes: ReturnType<InviteStaffToStore>
): ResultAsync<StaffInvitation, HTTPErrorCarrier> => inviteStaffToStoreRes.mapErr(err => match(err)
  .with(P.union(DBStaffNotFoundError.is, DBStoreNotFoundError.is, DBStoreNotFoundError.is, DBStaffInvitationAlreadyExistsError.is, DuplicateStaffInvitationError.is), (err) => HTTPErrorCarrier(
    StatusCode.BadRequest,
    {
      message: err.message,
      code: 'DATABASE_NOT_FOUND',
      details: [err.cause, err.extra],
    }
  ))
  .with(CreateStaffInvitationPermissionError.is, (err) => HTTPErrorCarrier(
    StatusCode.Forbidden,
    {
      message: err.message,
      code: 'PERMISSION_DENIED',
      details: [err.cause, err.extra],
    }
  ))
  .with(P.union(InvalidStaffInvitationError.is,InvalidStoreError.is,InvalidStaffRoleError.is,InvalidStaffForStoreError.is), (err) => HTTPErrorCarrier(
    StatusCode.InternalServerError,
    {
      message: err.message,
      code: 'DATABASE_INCONSISTENT_TYPE',
      details: [err.cause, err.extra],
    }
  ))
  .with(DBInternalError.is, (err) => HTTPErrorCarrier(
    StatusCode.InternalServerError,
    {
      message: err.message,
      code: 'DATABASE_UNKNOWN_ERROR',
      details: [err.cause, err.extra],
    }
  ))
  .exhaustive()
)