import { FetchUser } from "../service/user-service";
import { match } from "ts-pattern";
import { DBInternalError } from "../infra/shared/db-error";
import { ResultAsync } from "neverthrow";
import { InvalidUserError, User } from "../domain/user";
import { HTTPErrorCarrier, StatusCode } from "./error/api-error";
import { DBUserNotFoundError } from "../infra/user-repo.error";

export const fetchUserController = (
  fetchUserRes: ReturnType<FetchUser>
): ResultAsync<User, HTTPErrorCarrier> =>
  fetchUserRes.mapErr((err) =>
    match(err)
      .with(DBInternalError.is, (e) =>
        HTTPErrorCarrier(StatusCode.InternalServerError, {
          message: e.message,
          code: "DATABASE_UNKNOWN_ERROR",
          details: [e.cause],
        })
      )
      .with(DBUserNotFoundError.is, (e) =>
        HTTPErrorCarrier(StatusCode.NotFound, {
          message: e.message,
          code: "DATABASE_NOT_FOUND",
          details: [e.cause],
        })
      )
      .with(InvalidUserError.is, (e) =>
        HTTPErrorCarrier(StatusCode.InternalServerError, {
          message: e.message,
          code: "DATABASE_INCONSISTENT_TYPE",
          details: [e.extra],
        })
      )
      .exhaustive()
  );
