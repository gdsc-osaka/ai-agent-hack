import { ResultAsync } from "neverthrow";
import { HTTPErrorCarrier, StatusCode } from "../error/api-error";
import { match, P } from "ts-pattern";
import { FaceEmbeddingError } from "../../infra/face-embedding-repo.error";
import { FirestoreInternalError } from "../../infra/shared/firestore-error";
import { CustomerAlreadyExistsError } from "../../infra/customer-repo.error";
import { DBInternalError } from "../../infra/shared/db-error";
import { InvalidCustomerError } from "../../domain/customer";

export type RegisterCustomerAllError =
  | FaceEmbeddingError
  | FirestoreInternalError
  | DBInternalError
  | CustomerAlreadyExistsError
  | InvalidCustomerError;

export const registerCustomerGlobalController = <T>(
  result: ResultAsync<T, RegisterCustomerAllError>
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
      .with(FirestoreInternalError.is, (e) =>
        HTTPErrorCarrier(StatusCode.InternalServerError, {
          message: e.message,
          code: "DATABASE_UNKNOWN_ERROR",
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
      .with(CustomerAlreadyExistsError.is, (e) =>
        HTTPErrorCarrier(StatusCode.Conflict, {
          message: e.message,
          code: "DATABASE_ALREADY_EXISTS",
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
