import { createId } from "@paralleldrive/cuid2";
import { Result, ResultAsync } from "neverthrow";
import { DBProfile, InvalidProfileError, Profile, validateProfile } from "../domain/profile";
import { CallCloudFunction, CloudFunctionProfileData } from "../infra/cloud-function-repo";
import { CloudFunctionError } from "../infra/cloud-function-repo.error";
import { DBInternalError } from "../infra/shared/db-error";

export type GenerateProfile = (
  audioFile: File
) => ResultAsync<Profile[], CloudFunctionError | InvalidProfileError | DBInternalError>;

const convertToDBProfile = (data: CloudFunctionProfileData): DBProfile => ({
  id: createId(),
  gender: data.gender || null,
  birthday: data.birthday ? new Date(data.birthday) : null,
  birthplace: data.birthplace || null,
  business: data.business || null,
  partner: data.partner || null,
  hobby: data.hobby || null,
  news: data.news || null,
  worry: data.worry || null,
  store: data.store || null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const validateProfiles = (
  profiles: DBProfile[]
): Result<Profile[], InvalidProfileError> => {
  return Result.combine(
    profiles.map((profile) => validateProfile(profile))
  );
};

export const generateProfile =
  (callCloudFunction: CallCloudFunction): GenerateProfile =>
  (audioFile: File) =>
    callCloudFunction("uploadAudio", audioFile)
      .map((cloudFunctionData) =>
        cloudFunctionData.map(convertToDBProfile)
      )
      .andThen((dbProfiles) => {
        const validationResult = validateProfiles(dbProfiles);
        return validationResult.match(
          (profiles) => ResultAsync.fromSafePromise(Promise.resolve(profiles)),
          (error) => ResultAsync.fromSafePromise(Promise.resolve()).andThen(() =>
            ResultAsync.fromSafePromise(
              Promise.reject(
                error instanceof Error ? error : new Error(
                  error && typeof error === 'object' && 'message' in error
                    ? String(error.message)
                    : String(error)
                )
              )
            )
          )
        );
      });
