ALTER TABLE "measured_values" ALTER COLUMN "chlor_value" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "measured_values" ALTER COLUMN "total_cl_value" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "measured_values" ALTER COLUMN "gebundenes_cl_value" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "measuring_system" ALTER COLUMN "chlor_value" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "measuring_system" ALTER COLUMN "redox_value" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "measuring_system" ALTER COLUMN "water_temp" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "measuring_system" ALTER COLUMN "flow" DROP NOT NULL;