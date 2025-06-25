import { ResultAsync } from "neverthrow";
import { HTTPErrorCarrier, StatusCode } from "./error/api-error";
import { match, P } from "ts-pattern";
import { DBInternalError } from "../infra/shared/db-error";
import {
  CustomerAlreadyExistsError,
  CustomerNotFoundError,
} from "../infra/customer-repo.error";
import {
  Customer,
  CustomerNotBelongsToStoreError,
  CustomerTosAlreadyAcceptedError,
  InvalidCustomerError,
} from "../domain/customer";
import { FirestoreInternalError } from "../infra/shared/firestore-error";
import {
  AcceptCustomerTos,
  AuthenticateCustomer,
  DeclineCustomerTos,
  RegisterCustomer,
} from "../service/customer-service";
import { FaceEmbeddingError } from "../infra/face-embedding-repo.error";
import { FaceAuthError } from "../infra/face-auth-repo.error";
import { DBStoreNotFoundError } from "../infra/store-repo.error";

export const registerCustomerController = (
  registerCustomerRes: ReturnType<RegisterCustomer>
): ResultAsync<Customer, HTTPErrorCarrier> =>
  registerCustomerRes.mapErr((err) =>
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
      .with(DBStoreNotFoundError.is, (e) =>
        HTTPErrorCarrier(StatusCode.NotFound, {
          message: e.message,
          code: "STORE_NOT_FOUND",
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

export const authenticateCustomerController = (
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

export const acceptCustomerTosController = (
  res: ReturnType<AcceptCustomerTos>
): ResultAsync<void, HTTPErrorCarrier> =>
  res.mapErr((err) =>
    match(err)
      .with(DBInternalError.is, (e) =>
        HTTPErrorCarrier(StatusCode.InternalServerError, {
          message: e.message,
          code: "DATABASE_UNKNOWN_ERROR",
        })
      )
      .with(CustomerNotFoundError.is, (e) =>
        HTTPErrorCarrier(StatusCode.NotFound, {
          message: e.message,
          code: "CUSTOMER_NOT_FOUND",
        })
      )
      .with(CustomerTosAlreadyAcceptedError.is, (e) =>
        HTTPErrorCarrier(StatusCode.Conflict, {
          message: e.message,
          code: "TOS_ALREADY_ACCEPTED",
        })
      )
      .with(InvalidCustomerError.is, (e) =>
        HTTPErrorCarrier(StatusCode.InternalServerError, {
          message: e.message,
          code: "DOMAIN_VALIDATION_ERROR",
        })
      )
      .exhaustive()
  );

export const declineCustomerTosController = (
  res: ReturnType<DeclineCustomerTos>
): ResultAsync<void, HTTPErrorCarrier> =>
  res.mapErr((err) =>
    match(err)
      .with(P.union(DBInternalError.is, FirestoreInternalError.is), (e) =>
        HTTPErrorCarrier(StatusCode.InternalServerError, {
          message: e.message,
          code: "DATABASE_UNKNOWN_ERROR",
        })
      )
      .with(CustomerNotFoundError.is, (e) =>
        HTTPErrorCarrier(StatusCode.NotFound, {
          message: e.message,
          code: "CUSTOMER_NOT_FOUND",
        })
      )
      .exhaustive()
  );
