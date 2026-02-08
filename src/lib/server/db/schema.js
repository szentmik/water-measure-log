import { refreshAll } from '$app/navigation';
import { updated } from '$app/state';
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
	chlorValue: numeric("chlor_value", { precision: 5, scale: 2 }),
	totalClValue: numeric("total_cl_value", { precision: 5, scale: 2 }),
	gebClValue: numeric("gebundenes_cl_value", { precision: 5, scale: 2 }),
	userId: text("user_id").notNull().references(() => users.id),
	updatedBy: text("updated_by").references(() => users.id),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const measuringSystem = pgTable("measuring_system", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	phValue: numeric("ph_value", { precision: 4, scale: 2 }),
	chlorValue: numeric("chlor_value", { precision: 5, scale: 2 }),
	redoxValue: integer("redox_value"),
	waterTemp: numeric("water_temp", { precision: 4, scale: 1 }),
	flow: numeric("flow", { precision: 6, scale: 2 }),
	filterBackwash: boolean("filter_backwash").$default(false).notNull(),
	userId: text("user_id").notNull().references(() => users.id),
	updatedBy: text("updated_by").references(() => users.id),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const activity = pgTable("action_lock", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	activity: boolean("activity").default(false).notNull(),
	userId: text("user_id").notNull().references(() => users.id),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations


export const userRelations = relations(users, ({ many }) => ({
	measurements: many(measuredValues),
	systemData: many(measuringSystem),
	activity: many(activity)
}));

export const measureRelations = relations(measuredValues, ({ one }) => ({
	user: one(users, {
		fields: [measuredValues.userId],
		references: [users.id]
	}),
	updatedByUser: one(users,{
		fields: [measuredValues.updatedBy],
		references: [users.id],
	}),
}));

export const measuringSystemRelations = relations(measuringSystem, ({ one }) => ({
	user: one(users, {
		fields: [measuringSystem.userId],
		references: [users.id],
	}),
	updatedByUser: one(users,{
		fields: [measuringSystem.updatedBy],
		references: [users.id],
	}),
}));

export const activityRelations = relations(activity, ({ one }) => ({
	user: one(users, {
		fields: [activity.userId],
		references: [users.id]
	})
}));