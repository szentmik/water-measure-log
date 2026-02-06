import { relations } from 'drizzle-orm';
import { pgTable, serial, text, integer, timestamp, varchar, numeric, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const rolesEnum = pgEnum("role_type", ["admin", "user"]);

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	role: rolesEnum("role_type").default("user").notNull(),
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const measuredValues = pgTable("measured_values", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	phValue: numeric("ph_value", { precision: 4, scale: 2 }),
	chlorValue: numeric("chlor_value", { precision: 5, scale: 2 }).notNull(),
	totalClValue: numeric("total_cl_value", { precision: 5, scale: 2 }).notNull(),
	gebClValue: numeric("gebundenes_cl_value", { precision: 5, scale: 2 }).notNull(),
	waterTemp: numeric("water_temp",{precision: 3, scale:1}).notNull(),
	filterBackwash: boolean("filter_backwash").$default(false),
	userId: text("user_id").notNull().references(() => users.id),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const userRelations = relations(users, ({many})=> ({
	measurements: many(measuredValues),
}));

export const measureRelations = relations(measuredValues, ({one})=>({
	user: one(users, {
		fields: [measuredValues.userId],
		references: [users.id]
	})
}));