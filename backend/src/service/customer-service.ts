import { Result, ResultAsync } from "neverthrow";
import { GetFaceEmbedding } from "../infra/face-embedding-repo";
import { RegisterEmbedding, DeleteEmbedding } from "../infra/face-auth-repo";
import {
  InserttDBCustomer,
  DeleteDBCustomerById,
  FindDBCustomerById,
  UpdateDBCustomer,
} from "../infra/customer-repo";
import db, { DBorTx } from "../db/db";
import type { FirebaseApp } from "../firebase";
import type { FaceEmbeddingError } from "../infra/face-embedding-repo.error";
import type { FirestoreInternalError } from "../infra/shared/firestore-error";
import {
  Customer,
  CustomerId,
  CustomerTosAlreadyAcceptedError,
  InvalidCustomerError,
  ValidateCustomer,
  checkTosNotAccepted,
  createCustomerWithTosAccepted,
} from "../domain/customer";
import type {
  CustomerAlreadyExistsError,
  CustomerNotFoundError, // IMPORTED
} from "../infra/customer-repo.error";
import type { DBInternalError } from "../infra/shared/db-error";
import { RunTransaction } from "../infra/transaction";

export type RegisterCustomerResult = ResultAsync<
  Customer,
  | FaceEmbeddingError
  | FirestoreInternalError
  | DBInternalError
  | CustomerAlreadyExistsError
  | InvalidCustomerError
>;

export type RegisterCustomer = (
  firebase: FirebaseApp,
  image: File
) => RegisterCustomerResult;

export const registerCustomer =
  (
    getFaceEmbedding: GetFaceEmbedding,
    registerEmbedding: RegisterEmbedding,
    insertDBCustomer: InserttDBCustomer,
    validateCustomer: ValidateCustomer
  ): RegisterCustomer =>
  (firebase: FirebaseApp, image: File) =>
    getFaceEmbedding(image)
      .andThen((embedding) => registerEmbedding(firebase)(embedding))
      .andThen((customerId) => insertDBCustomer(db)({ id: customerId }))
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
  firebase: FirebaseApp,
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
    deleteEmbedding: DeleteEmbedding
  ): DeclineCustomerTos =>
  (firebase, customerId) =>
    // First, delete the database record
    runTransaction(db)((tx: DBorTx) =>
      findDBCustomerById(tx)(customerId) // Ensure it exists before trying to delete
        .andThen(() => deleteDBCustomerById(tx)(customerId))
    )
      // Then, delete the face embedding data from Firestore
      .andThen(() => deleteEmbedding(firebase)(customerId));
