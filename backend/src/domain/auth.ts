import { DecodedIdToken } from "firebase-admin/auth";
import z from "zod";

export const Uid = z.string().brand("Uid");
export type Uid = z.infer<typeof Uid>;

export type AuthUser = Omit<DecodedIdToken, "uid"> & {
  uid: Uid;
};

export const convertToAuthUser = (decodedIdToken: DecodedIdToken): AuthUser => {
  return {
    ...decodedIdToken,
    uid: decodedIdToken.uid as Uid,
  };
};
