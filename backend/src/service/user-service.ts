import { AuthUser } from "../domain/auth";
import { ResultAsync } from "neverthrow";
import { InvalidUserError, User, validateUser } from "../domain/user";
import { DBInternalError } from "../infra/shared/db-error";
import { DBUserNotFoundError } from "../infra/user-repo.error";
import { FetchDBUserByUid } from "../infra/user-repo";
import db from "../db/db";

export type FetchUser = (
  authUser: AuthUser
) => ResultAsync<
  User,
  DBInternalError | DBUserNotFoundError | InvalidUserError
>;

export const fetchUser =
  (fetchUserByUid: FetchDBUserByUid): FetchUser =>
  (authUser: AuthUser) =>
    fetchUserByUid(db)(authUser.uid).andThen(validateUser);
