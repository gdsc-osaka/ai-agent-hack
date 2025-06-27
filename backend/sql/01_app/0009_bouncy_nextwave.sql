CREATE TABLE "store_api_keys" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"api_key" varchar(128) NOT NULL,
	"store_id" varchar(25) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "store_api_keys_api_key_unique" UNIQUE("api_key")
);
--> statement-breakpoint
ALTER TABLE "store_api_keys" ADD CONSTRAINT "store_api_keys_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "store_api_keys_api_key_idx" ON "store_api_keys" USING btree ("api_key");