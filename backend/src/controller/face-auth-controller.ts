import { FaceAuth } from "../service/face-auth-service";
import { ResultAsync } from "neverthrow";
import { HTTPErrorCarrier } from "./error/api-error";
import { Customer } from "../domain/customer";
import { faceAuthGlobalController } from "./shared/face-auth-global-controller";

export const faceAuthController = (
  faceAuthRes: ReturnType<FaceAuth>
): ResultAsync<Customer, HTTPErrorCarrier> =>
  faceAuthGlobalController(faceAuthRes);
