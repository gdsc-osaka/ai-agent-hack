import z from "zod";
import "zod-openapi/extend";

export const ApiErrorCode = z
  .enum([
    "DATABASE_UNKNOWN_ERROR",
    "DATABASE_NOT_FOUND",
    "DATABASE_INCONSISTENT_TYPE",
  ])
  .openapi({ ref: "ApiErrorCode" });
export type ApiErrorCode = z.infer<typeof ApiErrorCode>;

export const ApiError = z
  .object({
    message: z.string(),
    code: ApiErrorCode,
    details: z.array(z.unknown()).default([]),
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

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export const HTTPErrorCarrier = (
  status: StatusCode,
  error: PartialBy<ApiError, "details">
) => ({
  status,
  error: {
    ...error,
    details: error.details?.filter((detail) => detail !== undefined) ?? [],
  },
});
export type HTTPErrorCarrier = ReturnType<typeof HTTPErrorCarrier>;
