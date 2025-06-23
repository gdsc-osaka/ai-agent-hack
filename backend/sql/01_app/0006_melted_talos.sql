ALTER TABLE "staff_invitations" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."staff_invitation_status";--> statement-breakpoint
CREATE TYPE "public"."staff_invitation_status" AS ENUM('PENDING', 'ACCEPTED', 'DECLINED');--> statement-breakpoint
ALTER TABLE "staff_invitations" ALTER COLUMN "status" SET DATA TYPE "public"."staff_invitation_status" USING "status"::"public"."staff_invitation_status";--> statement-breakpoint
CREATE INDEX "staff_invitations_token_idx" ON "staff_invitations" USING btree ("token");