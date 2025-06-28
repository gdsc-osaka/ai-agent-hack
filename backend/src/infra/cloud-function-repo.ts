import { ResultAsync } from "neverthrow";
import { CloudFunctionError } from "./cloud-function-repo.error";

export type CloudFunctionProfileData = {
  gender: string;
  birthday: string;
  birthplace: string;
  business: string;
  partner: string;
  hobby: string;
  news: string;
  worry: string;
  store: string;
};

export type CallCloudFunction = (
  functionName: string,
  file: File
) => ResultAsync<CloudFunctionProfileData[], CloudFunctionError>;

export const callCloudFunction: CallCloudFunction = (functionName, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return ResultAsync.fromPromise(
    fetch(
      `https://asia-northeast1-recall-you.cloudfunctions.net/${functionName}`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data: unknown) => data as CloudFunctionProfileData[]),
    CloudFunctionError.handle
  );
};
