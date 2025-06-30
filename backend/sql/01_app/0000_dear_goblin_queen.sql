CREATE TYPE "public"."staff_invitation_status" AS ENUM('PENDING', 'ACCEPTED', 'DECLINED');--> statement-breakpoint
CREATE TYPE "public"."staff_role" AS ENUM('ADMIN', 'STAFF');--> statement-breakpoint
CREATE TABLE "customers" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"tos_accepted_at" timestamp,
	"store_id" varchar(25) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"gender" text,
	"birthday" date,
	"birthplace" text,
	"business" text,
	"partner" text,
	"hobby" text,
	"news" text,
	"worry" text,
	"store" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff_invitations" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"role" "staff_role" NOT NULL,
	"store_id" varchar(25) NOT NULL,
	"target_email" varchar(255) NOT NULL,
	"invited_by" varchar(25) NOT NULL,
	"token" varchar(128) NOT NULL,
	"status" "staff_invitation_status" NOT NULL,
	"expired_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "staff_invitations_token_unique" UNIQUE("token"),
	CONSTRAINT "staff_invitations_unique_idx" UNIQUE("store_id","target_email")
);
--> statement-breakpoint
CREATE TABLE "store_api_keys" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"api_key" varchar(128) NOT NULL,
	"store_id" varchar(25) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "store_api_keys_api_key_unique" UNIQUE("api_key")
);
--> statement-breakpoint
CREATE TABLE "staffs" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "staffs_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"public_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "stores_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "stores_to_staffs" (
	"store_id" varchar(25) NOT NULL,
	"staff_id" varchar(25) NOT NULL,
	"role" "staff_role" NOT NULL,
	CONSTRAINT "stores_to_staffs_store_id_staff_id_pk" PRIMARY KEY("store_id","staff_id")
);
--> statement-breakpoint
CREATE TABLE "visits" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"store_id" varchar(25) NOT NULL,
	"customer_id" varchar(25) NOT NULL,
	"checkin_at" timestamp NOT NULL,
	"checkout_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_invitations" ADD CONSTRAINT "staff_invitations_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_invitations" ADD CONSTRAINT "staff_invitations_invited_by_staffs_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."staffs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_api_keys" ADD CONSTRAINT "store_api_keys_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores_to_staffs" ADD CONSTRAINT "stores_to_staffs_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores_to_staffs" ADD CONSTRAINT "stores_to_staffs_staff_id_staffs_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staffs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "staff_invitations_store_id_target_email_status_idx" ON "staff_invitations" USING btree ("store_id","target_email","status");--> statement-breakpoint
CREATE INDEX "staff_invitations_token_idx" ON "staff_invitations" USING btree ("token");--> statement-breakpoint
CREATE INDEX "store_api_keys_api_key_idx" ON "store_api_keys" USING btree ("api_key");--> statement-breakpoint
CREATE INDEX "staffs_user_id_idx" ON "staffs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stores_public_id_idx" ON "stores" USING btree ("public_id");