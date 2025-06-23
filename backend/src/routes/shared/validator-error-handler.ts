import { TypedResponse, ValidationTargets } from "hono";
import type { ZodError, ZodSchema } from "zod";
import { toHTTPException } from "./exception";
import { HTTPErrorCarrier, StatusCode } from "../../controller/error/api-error";

export const zValidatorErrorHandler = <
  T,
  // E extends Env,
  // P extends string,
  Target extends keyof ValidationTargets = keyof ValidationTargets,
  O = object,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Schema extends ZodSchema = any,
>(
  result: (
    | {
        success: true;
        data: T;
      }
    | {
        success: false;
        error: ZodError<Schema>;
        data: T;
      }
  ) & {
    target: Target;
  }
  // _: Context<E, P>
):
  | Response
  | void
  | TypedResponse<O>
  | Promise<Response | void | TypedResponse<O>> => {
  if (!result.success) {
    throw toHTTPException(
      HTTPErrorCarrier(StatusCode.BadRequest, {
        message: result.error.message,
        code: "INVALID_REQUEST_BODY",
        details: [result.error.flatten().fieldErrors],
      })
    );
  }
};
