import { ResultAsync } from "neverthrow";
import { match } from "ts-pattern";
import { InvalidProfileError, Profile } from "../domain/profile";
import { CloudFunctionError } from "../infra/cloud-function-repo.error";
import { DBInternalError } from "../infra/shared/db-error";
import { GenerateProfile } from "../service/profiles-service";
import { HTTPErrorCarrier, StatusCode } from "./error/api-error";
import { convertErrorToApiError } from "./error/api-error-utils";

export const generateProfileController = (
  generateProfileRes: ReturnType<GenerateProfile>
): ResultAsync<Profile[], HTTPErrorCarrier> =>
  generateProfileRes.mapErr((err) =>
    HTTPErrorCarrier(
      match(err)
        .with(CloudFunctionError.is, () => StatusCode.InternalServerError)
        .with(InvalidProfileError.is, () => StatusCode.BadRequest)
        .with(DBInternalError.is, () => StatusCode.InternalServerError)
        .exhaustive(),
      convertErrorToApiError(err)
    )
  );
