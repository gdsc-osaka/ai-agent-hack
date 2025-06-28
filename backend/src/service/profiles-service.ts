import { ResultAsync } from "neverthrow";
import {
  CallCloudFunction,
  UploadAudioResponse,
} from "../infra/cloud-function-repo";
import {
  CloudFunctionError,
  UploadAudioError,
} from "../infra/cloud-function-repo.error";

export type GenerateProfile = (
  audioFile: File
) => ResultAsync<UploadAudioResponse, CloudFunctionError | UploadAudioError>;

export const generateProfile =
  (callCloudFunction: CallCloudFunction): GenerateProfile =>
  (audioFile: File) =>
    callCloudFunction("uploadAudio", audioFile);
