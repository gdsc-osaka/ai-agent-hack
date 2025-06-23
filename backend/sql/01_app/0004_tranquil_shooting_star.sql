ALTER TABLE "profile" RENAME TO "profiles";--> statement-breakpoint
ALTER TABLE "staffs" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "staffs" ADD CONSTRAINT "staffs_email_unique" UNIQUE("email");