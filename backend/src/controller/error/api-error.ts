import z from "zod";
import "zod-openapi/extend";

export const ApiErrorCode = z
  .enum(["DATABASE_UNKNOWN_ERROR", "DATABASE_NOT_FOUND"])
  .openapi({ ref: "ApiErrorCode" });
export type ApiErrorCode = z.infer<typeof ApiErrorCode>;

export const ApiError = z
  .object({
    message: z.string(),
    code: ApiErrorCode,
    details: z.record(z.unknown()).optional(),
  })
  .openapi({ ref: "ApiError" });
export type ApiError = z.infer<typeof ApiError>;

export enum StatusCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  TooManyRequests = 429,
  InternalServerError = 500,
  NotImplemented = 501,
  ServiceUnavailable = 503,
}

export const ErrorCarrier = (status: StatusCode, error: ApiError) => ({
  status,
  error,
});
export type ErrorCarrier = ReturnType<typeof ErrorCarrier>;
