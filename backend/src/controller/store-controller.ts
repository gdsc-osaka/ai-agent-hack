import { CreateStore, FetchStoresForStaff } from "../service/store-service";
import { ResultAsync } from "neverthrow";
import { HTTPErrorCarrier } from "./error/api-error";
import { Store } from "../domain/store";
import { globalController } from "./shared/global-controller";

export const createStoreController = (
  createStoreRes: ReturnType<CreateStore>
): ResultAsync<Store, HTTPErrorCarrier> => globalController(createStoreRes);

export const fetchStoresForStaffController = (
  fetchStoresForStaffRes: ReturnType<FetchStoresForStaff>
): ResultAsync<Store[], HTTPErrorCarrier> =>
  globalController(fetchStoresForStaffRes);
