import { DecodedIdToken } from "firebase-admin/auth";
import z from "zod";

export const Uid = z.string().brand<"UID">();
export type Uid = z.infer<typeof Uid>;

export type AuthUser = Omit<DecodedIdToken, "uid"> & {
  uid: Uid;
};

export const validateAuthUser = (decodedIdToken: DecodedIdToken): AuthUser => {
  return {
    ...decodedIdToken,
    uid: decodedIdToken.uid as Uid,
  };
};
