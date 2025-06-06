import { HTTPException } from "hono/http-exception";
import { HTTPErrorCarrier } from "../../controller/error/api-error";

export const toHTTPException = (err: HTTPErrorCarrier) =>
  new HTTPException(err.status, {
    message: err.error.message,
    res: new Response(
      JSON.stringify({
        code: err.error.code,
        message: err.error.message,
        details: err.error.details,
      }),
      {
        status: err.status,
        headers: {
          "Content-Type": "application/json",
        },
      }
    ),
  });
