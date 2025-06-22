import { ResultAsync } from "neverthrow";
import { GetFaceEmbedding } from "../infra/face-embedding-repo";
import { RegisterEmbedding } from "../infra/face-auth-repo";
import { CreatetDBCustomer } from "../infra/customer-repo";
import db from "../db/db";
import type { FirebaseApp } from "../firebase";
import type { FaceEmbeddingError } from "../infra/face-embedding-repo.error";
import type { FirestoreInternalError } from "../infra/shared/firestore-error";
import {
  Customer,
  InvalidCustomerError,
  ValidateCustomer,
} from "../domain/customer";
import type { CustomerAlreadyExistsError } from "../infra/customer-repo.error";
import type { DBInternalError } from "../infra/shared/db-error";

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
    createDBCustomer: CreatetDBCustomer,
    validateCustomer: ValidateCustomer
  ): RegisterCustomer =>
  (firebase: FirebaseApp, image: File) =>
    getFaceEmbedding(image)
      .andThen((embedding) => registerEmbedding(firebase)(embedding))
      .andThen((customerId) => createDBCustomer(db)(customerId))
      .andThen((customer) => validateCustomer(customer));
