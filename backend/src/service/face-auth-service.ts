import { ResultAsync } from "neverthrow";
import { GetFaceEmbedding } from "../infra/face-embedding-repo";
import { FindCustomerIdByFaceEmbedding } from "../infra/face-auth-repo";
import db from "../db/db";
import { FindDBCustomerById } from "../infra/customer-repo";
import firebase, { firestoreDB } from "../firebase";
import type { FaceEmbeddingError } from "../infra/face-embedding-repo.error";
import type { FaceAuthError } from "../infra/face-auth-repo.error";
import type { FirestoreInternalError } from "../infra/shared/firestore-error";
import {
  checkCustomerBelongsToStore,
  Customer,
  CustomerNotBelongsToStoreError,
  InvalidCustomerError,
  ValidateCustomer,
} from "../domain/customer";
import type { CustomerNotFoundError } from "../infra/customer-repo.error";
import type { DBInternalError } from "../infra/shared/db-error";
import env from "../env";
import { FetchDBStoreById } from "../infra/store-repo";
import { DBStoreNotFoundError } from "../infra/store-repo.error";

export type FaceAuth = (
  storeId: string,
  image: File
) => ResultAsync<
  Customer,
  | FaceEmbeddingError
  | FaceAuthError
  | FirestoreInternalError
  | CustomerNotFoundError
  | DBInternalError
  | DBStoreNotFoundError
  | InvalidCustomerError
  | CustomerNotBelongsToStoreError
>;

export const authenticateFace =
  (
    fetchDBStoreById: FetchDBStoreById,
    getFaceEmbedding: GetFaceEmbedding,
    findCustomerIdByFaceEmbedding: FindCustomerIdByFaceEmbedding,
    findDBCustomerById: FindDBCustomerById,
    validateCustomer: ValidateCustomer
  ): FaceAuth =>
  (storeId, image) =>
    ResultAsync.combine([
      getFaceEmbedding(image).andThen(
        findCustomerIdByFaceEmbedding(
          firestoreDB(firebase(env.FIRE_SA).firestore())
        )
      ),
      fetchDBStoreById(db)(storeId),
    ])
      .andThen(([customerId, store]) =>
        findDBCustomerById(db)(customerId).andThen((customer) =>
          checkCustomerBelongsToStore(customer, store)
        )
      )
      .andThen((customer) => validateCustomer(customer));
