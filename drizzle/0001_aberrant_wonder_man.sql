CREATE TABLE "action_lock" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "action_lock_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"activity" boolean DEFAULT false NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "measuring_system" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "measuring_system_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ph_value" numeric(4, 2),
	"chlor_value" numeric(5, 2) NOT NULL,
	"redox_value" integer NOT NULL,
	"water_temp" numeric(3, 1) NOT NULL,
	"flow" numeric(6, 2) NOT NULL,
	"filter_backwash" boolean,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "action_lock" ADD CONSTRAINT "action_lock_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measuring_system" ADD CONSTRAINT "measuring_system_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measured_values" DROP COLUMN "water_temp";--> statement-breakpoint
ALTER TABLE "measured_values" DROP COLUMN "filter_backwash";