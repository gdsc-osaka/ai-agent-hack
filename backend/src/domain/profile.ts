import { profile } from "../db/schema/profile";
import z from "zod";
import "zod-openapi/extend";
import { err, ok, Result } from "neverthrow";
import { Timestamp, toTimestamp } from "./timestamp";
import { FieldErrors, ForUpdate, OmitBrand } from "./shared/types";
import { errorBuilder, InferError } from "../shared/error";

export const ProfileId = z.string().min(1).brand<"PROFILE_ID">();
export type ProfileId = z.infer<typeof ProfileId>;

export const Profile = z
  .object({
    id: ProfileId,
    gender: z.string().optional(),
    birthday: z.preprocess((arg) => {
      if (arg instanceof Date) {
        return arg.toISOString();
      }
      return typeof arg === "string" ? arg : "";
    }, z.string().optional()),
    birthplace: z.string().optional(),
    business: z.string().optional(),
    partner: z.string().optional(),
    hobby: z.string().optional(),
    news: z.string().optional(),
    worry: z.string().optional(),
    store: z.string().optional(),
    createdAt: Timestamp,
    updatedAt: Timestamp,
  });
export type Profile = z.infer<typeof Profile>;

export type DBProfile = typeof profile.$inferSelect;
export type DBProfileForCreate = typeof profile.$inferInsert;
export type DBProfileForUpdate = ForUpdate<DBProfile>;

export const InvalidProfileError = errorBuilder<
  "InvalidProfileError",
  FieldErrors<typeof Profile>
>("InvalidProfileError");
export type InvalidProfileError = InferError<typeof InvalidProfileError>;

export const validateProfile = (profile: DBProfile): Result<Profile, InvalidProfileError> => {
  const res = Profile.safeParse({
    id: profile.id as ProfileId,
    gender: profile.gender ?? "",
    birthday: profile.birthday ?? "",
    birthplace: profile.birthplace ?? "",
    business: profile.business ?? "",
    partner: profile.partner ?? "",
    hobby: profile.hobby ?? "",
    news: profile.news ?? "",
    worry: profile.worry ?? "",
    store: profile.store ?? "",
    createdAt: toTimestamp(profile.createdAt),
    updatedAt: toTimestamp(profile.updatedAt),
  } satisfies OmitBrand<Profile>);

  if (res.success) return ok(res.data);

  return err(
    InvalidProfileError("Invalid profile data", {
      cause: res.error,
      extra: res.error.flatten().fieldErrors,
    })
  );
};
