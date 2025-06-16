import { AuthUser } from "../domain/auth";
import { ResultAsync } from "neverthrow";
import {
  createNewStore,
  InvalidStoreError,
  Store,
  validateStore,
  validateStores,
} from "../domain/store";
import { DBInternalError } from "../infra/shared/db-error";
import { DBStoreAlreadyExistsError } from "../infra/store-repo.error";
import { InsertDBStore, FetchDBStoresForStaff } from "../infra/store-repo";
import db from "../db/db";
import { FetchDBStaffByUserId } from "../infra/staff-repo";
import { RunTransaction } from "../infra/transaction";
import { InvalidStaffError, validateStaff } from "../domain/staff";
import { assignAdminStaffToStore } from "../domain/store-staff";
import { InsertDBStoreToStaff } from "../infra/store-to-staff-repo";
import { DBStaffNotFoundError } from "../infra/staff-repo.error";
import { DBStoreToStaffAlreadyExistsError } from "../infra/store-to-staff-repo.error";

export type CreateStore = (
  authUser: AuthUser,
  publicId: string
) => ResultAsync<
  Store,
  | DBInternalError
  | DBStoreAlreadyExistsError
  | DBStaffNotFoundError
  | DBStoreToStaffAlreadyExistsError
  | InvalidStoreError
  | InvalidStaffError
>;

export const createStore =
  (
    insertDBStore: InsertDBStore,
    fetchDBStaffByUserId: FetchDBStaffByUserId,
    insertDBStoreToStaff: InsertDBStoreToStaff,
    runTransaction: RunTransaction
  ): CreateStore =>
  (authUser: AuthUser, publicId: string) =>
    fetchDBStaffByUserId(db)(authUser.uid)
      .andThen(validateStaff)
      .andThen((staff) =>
        runTransaction(db)((tx) =>
          createNewStore(publicId)
            .asyncAndThen(insertDBStore(tx))
            .andThen((store) =>
              assignAdminStaffToStore(store, staff)
                .asyncAndThen(insertDBStoreToStaff(tx))
                .andThen(() => validateStore(store))
            )
        )
      );

export type FetchStoresForStaff = (
  authUser: AuthUser
) => ResultAsync<
  Store[],
  DBInternalError | DBStaffNotFoundError | InvalidStoreError | InvalidStaffError
>;

export const fetchStoresForStaff =
  (
    fetchDBStaffByUserId: FetchDBStaffByUserId,
    selectDBStoresForStaff: FetchDBStoresForStaff
  ): FetchStoresForStaff =>
  (authUser: AuthUser) =>
    fetchDBStaffByUserId(db)(authUser.uid)
      .andThen(validateStaff)
      .map((staff) => staff.id)
      .andThen(selectDBStoresForStaff(db))
      .andThen(validateStores);
