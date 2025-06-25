CREATE TABLE "visits" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"store_id" varchar(25) NOT NULL,
	"customer_id" varchar(25) NOT NULL,
	"checkin_at" timestamp NOT NULL,
	"checkout_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;