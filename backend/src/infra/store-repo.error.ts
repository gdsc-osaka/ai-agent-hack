import { errorBuilder, InferError } from "../shared/error";
import z from "zod";

export const DBStoreAlreadyExistsError = errorBuilder(
  "DBStoreAlreadyExistsError",
  z.object({ publicId: z.string() })
);
export type DBStoreAlreadyExistsError = InferError<
  typeof DBStoreAlreadyExistsError
>;

export const DBStoreNotFoundError = errorBuilder(
  "DBStoreNotFoundError",
  z.object({ publicId: z.string() })
);
export type DBStoreNotFoundError = InferError<typeof DBStoreNotFoundError>;
