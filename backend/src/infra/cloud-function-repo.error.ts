import { errorBuilder, InferError } from "../shared/error";

export const CloudFunctionError = errorBuilder("CloudFunctionError");
export type CloudFunctionError = InferError<typeof CloudFunctionError>;
