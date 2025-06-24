import { ResultAsync } from "neverthrow";
import { HTTPErrorCarrier, StatusCode } from "./error/api-error";
import { match, P } from "ts-pattern";
import { DBInternalError } from "../infra/shared/db-error";
import { CustomerNotFoundError } from "../infra/customer-repo.error";
import {
  Customer,
  CustomerTosAlreadyAcceptedError,
  InvalidCustomerError,
} from "../domain/customer";
import { FirestoreInternalError } from "../infra/shared/firestore-error";
import {
  AcceptCustomerTos,
  DeclineCustomerTos,
  RegisterCustomer,
} from "../service/customer-service";
import { registerCustomerGlobalController } from "./shared/register-customer-global-controller";

export const registerCustomerController = (
  registerCustomerRes: ReturnType<RegisterCustomer>
): ResultAsync<Customer, HTTPErrorCarrier> =>
  registerCustomerGlobalController(registerCustomerRes);

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
