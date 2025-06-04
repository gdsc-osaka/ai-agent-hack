import { ResultAsync } from "neverthrow";
import firebase from "../firebase";
import { infraLogger } from "../logger";
import env from "../env";
import {
  AuthError,
  AuthUnknownError,
  handleFirebaseAuthError,
} from "./auth-repo.error";
import { match } from "ts-pattern";
import { AuthUser, convertToAuthUser } from "../domain/auth";

export type VerifyIdToken = (
  fireSa: string,
  idToken: string,
) => ResultAsync<AuthUser, AuthError>;

export const verifyIdToken: VerifyIdToken = (fireSa, idToken) =>
  ResultAsync.fromPromise(
    firebase(fireSa).auth().verifyIdToken(idToken),
    handleFirebaseAuthError,
  )
    // ドメイン層に依存してるが, 局所的なので許してください
    .map(convertToAuthUser)
    .orTee(infraLogger("verifyIdToken").warn);

export type DeleteAuthUser = (uid: string) => ResultAsync<void, AuthError>;
const deleteAuthUserLogger = infraLogger("deleteAuthUser");
export const deleteAuthUser: DeleteAuthUser = (uid) =>
  ResultAsync.fromPromise(
    firebase(env.FIRE_SA).auth().deleteUser(uid),
    handleFirebaseAuthError,
  )
    .andTee(deleteAuthUserLogger.info)
    .orTee((error) =>
      match(error)
        .with(AuthUnknownError.is, deleteAuthUserLogger.error)
        .otherwise(deleteAuthUserLogger.warn),
    );
