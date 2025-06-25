import { createId } from "@paralleldrive/cuid2";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { CUID_LENGTH } from "../../constants";
import { stores } from "./stores";

export const customers = pgTable("customers", {
  id: varchar("id", { length: CUID_LENGTH })
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  tosAcceptedAt: timestamp("tos_accepted_at"),
  storeId: varchar("store_id", { length: CUID_LENGTH })
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});
