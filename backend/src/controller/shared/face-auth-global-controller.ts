import { ResultAsync } from "neverthrow";
import { HTTPErrorCarrier, StatusCode } from "../error/api-error";
import { match } from "ts-pattern";
import { FaceEmbeddingError } from "../../infra/face-embedding-repo.error";
import { FaceAuthError } from "../../infra/face-auth-repo.error";
import { FirestoreInternalError } from "../../infra/shared/firestore-error";
import { CustomerNotFoundError } from "../../infra/customer-repo.error";
import { DBInternalError } from "../../infra/shared/db-error";
import { InvalidCustomerError } from "../../domain/customer";

export type FaceAuthAllError =
  | FaceEmbeddingError
  | FaceAuthError
  | FirestoreInternalError
  | CustomerNotFoundError
  | DBInternalError
  | InvalidCustomerError;

export const faceAuthGlobalController = <T>(
  result: ResultAsync<T, FaceAuthAllError>
) =>
  result.mapErr((err) =>
    match(err)
      .with(FaceEmbeddingError.is, (e) =>
        HTTPErrorCarrier(StatusCode.InternalServerError, {
          message: e.message,
          code: "DATABASE_UNKNOWN_ERROR",
          details: [e.cause],
        })
      )
      .with(FaceAuthError.is, (e) =>
        HTTPErrorCarrier(StatusCode.InternalServerError, {
          message: e.message,
          code: "DATABASE_UNKNOWN_ERROR",
          details: [e.cause],
        })
      )
      .with(FirestoreInternalError.is, (e) =>
        HTTPErrorCarrier(StatusCode.InternalServerError, {
          message: e.message,
          code: "DATABASE_UNKNOWN_ERROR",
          details: [e.cause],
        })
      )
      .with(CustomerNotFoundError.is, (e) =>
        HTTPErrorCarrier(StatusCode.NotFound, {
          message: e.message,
          code: "DATABASE_NOT_FOUND",
          details: [e.cause],
        })
      )
      .with(DBInternalError.is, (e) =>
        HTTPErrorCarrier(StatusCode.InternalServerError, {
          message: e.message,
          code: "DATABASE_UNKNOWN_ERROR",
          details: [e.cause],
        })
      )
      .with(InvalidCustomerError.is, (e) =>
        HTTPErrorCarrier(StatusCode.BadRequest, {
          message: e.message,
          code: "INVALID_REQUEST_BODY",
          details: [e.extra],
        })
      )
      .exhaustive()
  );
