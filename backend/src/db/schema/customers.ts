import { createId } from "@paralleldrive/cuid2";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { CUID_LENGTH } from "../constants";

export const customers = pgTable(
  "customers",
  {
    id: varchar("id", { length: CUID_LENGTH })
      .$defaultFn(() => createId())
      .primaryKey()
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
);
