import { Result, ResultAsync } from "neverthrow";
import { GetFaceEmbedding } from "../infra/face-embedding-repo";
import {
  DeleteFaceEmbedding,
  FindCustomerIdByFaceEmbedding,
  InsertFaceEmbedding,
} from "../infra/face-auth-repo";
import {
  DeleteDBCustomerById,
  FindDBCustomerById,
  InserttDBCustomer,
  UpdateDBCustomer,
} from "../infra/customer-repo";
import db, { DBorTx } from "../db/db";
import firebase, { firestoreDB } from "../firebase";
import type { FaceEmbeddingError } from "../infra/face-embedding-repo.error";
import type { FirestoreInternalError } from "../infra/shared/firestore-error";
import {
  checkCustomerBelongsToStore,
  checkTosNotAccepted,
  createCustomer,
  createCustomerWithTosAccepted,
  Customer,
  CustomerId,
  CustomerNotBelongsToStoreError,
  CustomerTosAlreadyAcceptedError,
  InvalidCustomerError,
  ValidateCustomer,
} from "../domain/customer";
import type {
  CustomerAlreadyExistsError,
  CustomerNotFoundError,
} from "../infra/customer-repo.error";
import type { DBInternalError } from "../infra/shared/db-error";
import { RunTransaction } from "../infra/transaction";
import env from "../env";
import { FetchDBStoreById } from "../infra/store-repo";
import { DBStoreNotFoundError } from "../infra/store-repo.error";
import type { FaceAuthError } from "../infra/face-auth-repo.error";

export type RegisterCustomer = (
  storeId: string,
  image: File
) => ResultAsync<
  Customer,
  | FaceEmbeddingError
  | FirestoreInternalError
  | DBInternalError
  | DBStoreNotFoundError
  | CustomerAlreadyExistsError
  | InvalidCustomerError
>;

export const registerCustomer =
  (
    fetchDBStoreById: FetchDBStoreById,
    getFaceEmbedding: GetFaceEmbedding,
    insertFaceEmbedding: InsertFaceEmbedding,
    insertDBCustomer: InserttDBCustomer,
    validateCustomer: ValidateCustomer
  ): RegisterCustomer =>
  (storeId, image: File) =>
    ResultAsync.combine([
      getFaceEmbedding(image),
      fetchDBStoreById(db)(storeId).andThen(createCustomer),
    ]).andThen(([embedding, customer]) =>
      insertFaceEmbedding(firestoreDB(firebase(env.FIRE_SA).firestore()))(
        customer,
        embedding
      )
        .andThen(() => insertDBCustomer(db)(customer))
        .andThen((customer) => validateCustomer(customer))
    );

export type AuthenticateCustomer = (
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
export const authenticateCustomer =
  (
    fetchDBStoreById: FetchDBStoreById,
    getFaceEmbedding: GetFaceEmbedding,
    findCustomerIdByFaceEmbedding: FindCustomerIdByFaceEmbedding,
    findDBCustomerById: FindDBCustomerById,
    validateCustomer: ValidateCustomer
  ): AuthenticateCustomer =>
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

export type AcceptCustomerTos = (
  customerId: CustomerId
) => ResultAsync<
  void,
  | DBInternalError
  | CustomerNotFoundError
  | CustomerTosAlreadyAcceptedError
  | InvalidCustomerError
>;

export const acceptCustomerTos =
  (
    runTransaction: RunTransaction,
    findDBCustomerById: FindDBCustomerById,
    updateDBCustomer: UpdateDBCustomer
  ): AcceptCustomerTos =>
  (customerId) =>
    runTransaction(db)((tx: DBorTx) =>
      findDBCustomerById(tx)(customerId)
        .andThen((customer) =>
          Result.combine([
            createCustomerWithTosAccepted(customer),
            checkTosNotAccepted(customer),
          ])
        )
        .andThen(([customer]) => updateDBCustomer(tx)(customer))
    ).map(() => undefined);

export type DeclineCustomerTos = (
  customerId: CustomerId
) => ResultAsync<
  void,
  DBInternalError | CustomerNotFoundError | FirestoreInternalError
>;

export const declineCustomerTos =
  (
    runTransaction: RunTransaction,
    findDBCustomerById: FindDBCustomerById, // To ensure customer exists before deleting
    deleteDBCustomerById: DeleteDBCustomerById,
    deleteEmbedding: DeleteFaceEmbedding
  ): DeclineCustomerTos =>
  (customerId) =>
    // First, delete the database record
    runTransaction(db)((tx: DBorTx) =>
      findDBCustomerById(tx)(customerId) // Ensure it exists before trying to delete
        .andThen(() => deleteDBCustomerById(tx)(customerId))
    )
      // Then, delete the face embedding data from Firestore
      .andThen(() =>
        deleteEmbedding(firestoreDB(firebase(env.FIRE_SA).firestore()))(
          customerId
        )
      );
