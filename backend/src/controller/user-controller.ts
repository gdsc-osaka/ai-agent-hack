import { FetchUser } from "../service/user-service";
import { match } from "ts-pattern";
import { DBInternalError } from "../infra/shared/db-error";
import { ResultAsync } from "neverthrow";
import { User } from "../domain/user";
import { ErrorCarrier, StatusCode } from "./error/api-error";
import { DBUserNotFoundError } from "../infra/user-repo.error";

export const fetchUserController = (
  fetchUserRes: ReturnType<FetchUser>,
): ResultAsync<User, ErrorCarrier> =>
  fetchUserRes.mapErr((err) =>
    match(err)
      .with(DBInternalError.is, (e) =>
        ErrorCarrier(StatusCode.InternalServerError, {
          message: e.message,
          code: "DATABASE_UNKNOWN_ERROR",
        }),
      )
      .with(DBUserNotFoundError.is, (e) =>
        ErrorCarrier(StatusCode.NotFound, {
          message: e.message,
          code: "DATABASE_NOT_FOUND",
        }),
      )
      .exhaustive(),
  );
