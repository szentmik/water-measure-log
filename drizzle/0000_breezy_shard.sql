CREATE TYPE "public"."role_type" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "measured_values" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "measured_values_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ph_value" numeric(4, 2),
	"chlor_value" numeric(5, 2) NOT NULL,
	"total_cl_value" numeric(5, 2) NOT NULL,
	"gebundenes_cl_value" numeric(5, 2) NOT NULL,
	"water_temp" numeric(3, 1) NOT NULL,
	"filter_backwash" boolean,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role_type" "role_type" DEFAULT 'user' NOT NULL,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "measured_values" ADD CONSTRAINT "measured_values_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;