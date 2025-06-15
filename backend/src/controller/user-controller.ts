import { FetchUser } from "../service/user-service";
import { ResultAsync } from "neverthrow";
import { User } from "../domain/user";
import { HTTPErrorCarrier } from "./error/api-error";
import { globalController } from "./shared/global-controller";

export const fetchUserController = (
  fetchUserRes: ReturnType<FetchUser>
): ResultAsync<User, HTTPErrorCarrier> => globalController(fetchUserRes);
