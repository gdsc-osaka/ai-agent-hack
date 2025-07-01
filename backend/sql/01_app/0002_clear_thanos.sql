ALTER TABLE "profiles" ADD COLUMN "customer_id" varchar(25);--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;

UPDATE "profiles" SET customer_id = 'dummy';

ALTER TABLE "profiles" ALTER COLUMN "customer_id" SET NOT NULL;
