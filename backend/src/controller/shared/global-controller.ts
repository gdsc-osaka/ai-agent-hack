import { ResultAsync } from "neverthrow";
import { DBInternalError } from "../../infra/shared/db-error";
import {
  DBUserAlreadyExistsError,
  DBUserNotFoundError,
} from "../../infra/user-repo.error";
import { match, P } from "ts-pattern";
import { HTTPErrorCarrier, StatusCode } from "../error/api-error";
import { InvalidUserError } from "../../domain/user";
import { DBStoreAlreadyExistsError } from "../../infra/store-repo.error";
import {
  DBStaffAlreadyExistsError,
  DBStaffNotFoundError,
} from "../../infra/staff-repo.error";
import { DBStoreToStaffAlreadyExistsError } from "../../infra/store-to-staff-repo.error";
import { InvalidStoreError } from "../../domain/store";
import { InvalidStaffError } from "../../domain/staff";

export type AllError =
  | DBInternalError
  | DBUserNotFoundError
  | DBUserAlreadyExistsError
  | DBStoreAlreadyExistsError
  | DBStaffNotFoundError
  | DBStaffAlreadyExistsError
  | DBStoreToStaffAlreadyExistsError
  | InvalidUserError
  | InvalidStoreError
  | InvalidStaffError;

export const globalController = <T>(result: ResultAsync<T, AllError>) =>
  result.mapErr((err) =>
    match(err)
      .with(DBInternalError.is, (e) =>
        HTTPErrorCarrier(StatusCode.InternalServerError, {
          message: e.message,
          code: "DATABASE_UNKNOWN_ERROR",
          details: [e.cause],
        })
      )
      .with(P.union(DBUserNotFoundError.is, DBStaffNotFoundError.is), (e) =>
        HTTPErrorCarrier(StatusCode.NotFound, {
          message: e.message,
          code: "DATABASE_NOT_FOUND",
          details: [e.cause],
        })
      )
      .with(
        P.union(
          DBUserAlreadyExistsError.is,
          DBStoreAlreadyExistsError.is,
          DBStaffAlreadyExistsError.is,
          DBStoreToStaffAlreadyExistsError.is
        ),
        (e) =>
          HTTPErrorCarrier(StatusCode.Conflict, {
            message: e.message,
            code: "DATABASE_ALREADY_EXISTS",
            details: [e.cause, e.extra],
          })
      )
      .with(
        P.union(
          InvalidUserError.is,
          InvalidStoreError.is,
          InvalidStaffError.is
        ),
        (e) =>
          HTTPErrorCarrier(StatusCode.InternalServerError, {
            message: e.message,
            code: "DATABASE_INCONSISTENT_TYPE",
            details: [e.cause, e.extra],
          })
      )
      .exhaustive()
  );
