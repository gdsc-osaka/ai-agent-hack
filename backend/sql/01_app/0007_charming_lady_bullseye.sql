ALTER TABLE "customers" ADD COLUMN "tos_accepted_at" timestamp;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "store_id" varchar(25) NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;