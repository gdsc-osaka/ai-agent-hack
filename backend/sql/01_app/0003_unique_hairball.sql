CREATE TABLE "profile" (
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
