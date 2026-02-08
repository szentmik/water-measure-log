ALTER TABLE "measuring_system" ALTER COLUMN "water_temp" SET DATA TYPE numeric(4, 1);--> statement-breakpoint
ALTER TABLE "measuring_system" ALTER COLUMN "filter_backwash" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "measured_values" ADD COLUMN "updated_by" text;--> statement-breakpoint
ALTER TABLE "measured_values" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "measuring_system" ADD COLUMN "updated_by" text;--> statement-breakpoint
ALTER TABLE "measuring_system" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "measured_values" ADD CONSTRAINT "measured_values_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measuring_system" ADD CONSTRAINT "measuring_system_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;