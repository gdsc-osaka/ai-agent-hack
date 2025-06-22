CREATE TYPE "public"."staff_invitation_status" AS ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');--> statement-breakpoint
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
ALTER TABLE "staff_invitations" ADD CONSTRAINT "staff_invitations_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_invitations" ADD CONSTRAINT "staff_invitations_invited_by_staffs_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."staffs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "staff_invitations_store_id_target_email_status_idx" ON "staff_invitations" USING btree ("store_id","target_email","status");