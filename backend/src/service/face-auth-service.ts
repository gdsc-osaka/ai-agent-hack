import { ResultAsync } from "neverthrow";
import { GetFaceEmbedding } from "../infra/face-embedding-repo";
import { AuthenticateFace } from "../infra/face-auth-repo";
import db from "../db/db";
import { FindDBCustomerById } from "../infra/customer-repo";
import type { FirebaseApp } from "../firebase";
import type { FaceEmbeddingError } from "../infra/face-embedding-repo.error";
import type { FaceAuthError } from "../infra/face-auth-repo.error";
import type { FirestoreInternalError } from "../infra/shared/firestore-error";
import type {
  Customer,
  InvalidCustomerError,
  ValidateCustomer,
} from "../domain/customer";
import type { CustomerNotFoundError } from "../infra/customer-repo.error";
import type { DBInternalError } from "../infra/shared/db-error";
export type FaceAuthResult = ResultAsync<
  Customer,
  | FaceEmbeddingError
  | FaceAuthError
  | FirestoreInternalError
  | CustomerNotFoundError
  | DBInternalError
  | InvalidCustomerError
>;

export type FaceAuth = (firebase: FirebaseApp, image: File) => FaceAuthResult;

export const authFace =
  (
    getFaceEmbedding: GetFaceEmbedding,
    authenticateFace: AuthenticateFace,
    findDBCustomerById: FindDBCustomerById,
    validateCustomer: ValidateCustomer
  ): FaceAuth =>
  (firebase: FirebaseApp, image: File) =>
    getFaceEmbedding(image)
      .andThen((embedding) => authenticateFace(firebase)(embedding))
      .andThen((customerId) => findDBCustomerById(db)(customerId))
      .andThen((customer) => validateCustomer(customer));
