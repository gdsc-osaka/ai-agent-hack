import { Timestamp } from "@/api";

export const convertTimestampToDate = (timestamp: Timestamp): Date => {
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
};
