import { ResultAsync } from "neverthrow";
import { HTTPErrorCarrier, StatusCode } from "./error/api-error";
import {
  Customer,
  CustomerNotBelongsToStoreError,
  InvalidCustomerError,
} from "../domain/customer";
import { match } from "ts-pattern";
import { FaceEmbeddingError } from "../infra/face-embedding-repo.error";
import { FaceAuthError } from "../infra/face-auth-repo.error";
import { FirestoreInternalError } from "../infra/shared/firestore-error";
import { CustomerNotFoundError } from "../infra/customer-repo.error";
import { DBInternalError } from "../infra/shared/db-error";
import { DBStoreNotFoundError } from "../infra/store-repo.error";
import { AuthenticateCustomer } from "../service/customer-service";

export const faceAuthController = (
  faceAuthRes: ReturnType<AuthenticateCustomer>
): ResultAsync<Customer, HTTPErrorCarrier> =>
  faceAuthRes.mapErr((err) =>
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
      .with(DBStoreNotFoundError.is, (e) =>
        HTTPErrorCarrier(StatusCode.NotFound, {
          message: e.message,
          code: "DATABASE_NOT_FOUND",
          details: [e.cause],
        })
      )
      .with(CustomerNotBelongsToStoreError.is, (e) =>
        HTTPErrorCarrier(StatusCode.Forbidden, {
          message: e.message,
          code: "CUSTOMER_NOT_BELONGS_TO_STORE",
          details: [e.cause],
        })
      )
      .exhaustive()
  );
