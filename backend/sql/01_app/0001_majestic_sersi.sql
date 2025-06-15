CREATE TYPE "public"."staff_role" AS ENUM('ADMIN', 'STAFF');--> statement-breakpoint
CREATE TABLE "staffs" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"public_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stores_to_staffs" (
	"store_id" varchar(25) NOT NULL,
	"staff_id" varchar(25) NOT NULL,
	"role" "staff_role" NOT NULL,
	CONSTRAINT "stores_to_staffs_store_id_staff_id_pk" PRIMARY KEY("store_id","staff_id")
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "stores_to_staffs" ADD CONSTRAINT "stores_to_staffs_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores_to_staffs" ADD CONSTRAINT "stores_to_staffs_staff_id_staffs_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staffs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "staffs_user_id_idx" ON "staffs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stores_public_id_idx" ON "stores" USING btree ("public_id");