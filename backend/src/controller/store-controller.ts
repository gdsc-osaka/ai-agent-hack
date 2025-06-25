import { CreateStore, FetchStoresForStaff } from "../service/store-service";
import { ResultAsync } from "neverthrow";
import { HTTPErrorCarrier, StatusCode } from "./error/api-error";
import { CreateNewStoreError, InvalidStoreError, Store } from "../domain/store";
import { match } from "ts-pattern";
import { DBInternalError } from "../infra/shared/db-error";
import { convertErrorToApiError } from "./error/api-error-utils";
import { DBStoreAlreadyExistsError } from "../infra/store-repo.error";
import { DBStoreToStaffAlreadyExistsError } from "../infra/store-to-staff-repo.error";
import { InvalidStaffError } from "../domain/staff";
import { DBStaffNotFoundError } from "../infra/staff-repo.error";

export const createStoreController = (
  createStoreRes: ReturnType<CreateStore>
): ResultAsync<Store, HTTPErrorCarrier> =>
  createStoreRes.mapErr((err) =>
    HTTPErrorCarrier(
      match(err)
        .with(DBInternalError.is, () => StatusCode.InternalServerError)
        .with(DBStaffNotFoundError.is, () => StatusCode.NotFound)
        .with(DBStoreAlreadyExistsError.is, () => StatusCode.Conflict)
        .with(DBStoreToStaffAlreadyExistsError.is, () => StatusCode.Conflict)
        .with(InvalidStoreError.is, () => StatusCode.BadRequest)
        .with(InvalidStaffError.is, () => StatusCode.BadRequest)
        .with(CreateNewStoreError.is, () => StatusCode.InternalServerError)
        .exhaustive(),
      convertErrorToApiError(err)
    )
  );

export const fetchStoresForStaffController = (
  fetchStoresForStaffRes: ReturnType<FetchStoresForStaff>
): ResultAsync<Store[], HTTPErrorCarrier> =>
  fetchStoresForStaffRes.mapErr((err) =>
    HTTPErrorCarrier(
      match(err)
        .with(DBInternalError.is, () => StatusCode.InternalServerError)
        .with(DBStaffNotFoundError.is, () => StatusCode.NotFound)
        .with(InvalidStoreError.is, () => StatusCode.BadRequest)
        .with(InvalidStaffError.is, () => StatusCode.BadRequest)
        .exhaustive(),
      convertErrorToApiError(err)
    )
  );
