import { createId } from "@paralleldrive/cuid2";
import { date, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { CUID_LENGTH } from "../../constants";

export const profiles = pgTable("profiles", {
  id: varchar("id", { length: CUID_LENGTH })
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  gender: text("gender"),
  birthday: date("birthday", { mode: "date" }),
  birthplace: text("birthplace"),
  business: text("business"),
  partner: text("partner"),
  hobby: text("hobby"),
  news: text("news"),
  worry: text("worry"),
  store: text("store"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});
