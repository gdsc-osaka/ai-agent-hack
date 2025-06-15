import { FieldErrors, ForUpdate } from "./shared/types";
import { stores } from "../db/schema/stores";
import z from "zod";
import { Timestamp } from "./timestamp";
import { errorBuilder, InferError } from "../shared/error";
import { err, ok, Result } from "neverthrow";

export type DBStore = typeof stores.$inferSelect;
export type DBStoreForCreate = typeof stores.$inferInsert;
export type DBStoreForUpdate = ForUpdate<DBStore>;

export const StoreId = z.string().min(1).brand<"STORE_ID">();
export type StoreId = z.infer<typeof StoreId>;

export const Store = z
  .object({
    id: StoreId,
    createdAt: Timestamp,
    updatedAt: Timestamp,
  })
  .brand<"STORE">()
  .openapi({ ref: "Store" });
export type Store = z.infer<typeof Store>;

export const InvalidStoreError = errorBuilder<
  "InvalidStoreError",
  FieldErrors<typeof Store>
>("InvalidStoreError");
export type InvalidStoreError = InferError<typeof InvalidStoreError>;

export type ValidateStore = (
  store: DBStore
) => Result<Store, InvalidStoreError>;
export const validateStore: ValidateStore = (
  store: DBStore
): Result<Store, InvalidStoreError> => {
  const res = Store.safeParse({
    id: store.id as StoreId,
    createdAt: Timestamp.parse(store.createdAt),
    updatedAt: Timestamp.parse(store.updatedAt),
  });

  if (res.success) return ok(res.data);

  return err(
    InvalidStoreError("Invalid store data", {
      cause: res.error,
      extra: res.error.flatten().fieldErrors,
    })
  );
};

export type ValidateStores = (
  stores: DBStore[]
) => Result<Store[], InvalidStoreError>;

export const validateStores: ValidateStores = (
  stores: DBStore[]
): Result<Store[], InvalidStoreError> =>
  Result.combine(stores.map(validateStore));

export type CreateNewStore = (
  publicId: string
) => Result<DBStoreForCreate, never>;
export const createNewStore: CreateNewStore = (
  publicId: string
): Result<DBStoreForCreate, never> => {
  return ok({
    publicId,
  });
};
