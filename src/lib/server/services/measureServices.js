import { db } from "../db";
import { eq, desc, asc } from "drizzle-orm";
import { measuredValues, measuringSystem } from "../db/schema";

export const measureServices = {
    async getComparisonData() {
        const [manual, system] = await Promise.all([
            db.select().from(measuredValues).orderBy(asc(measuredValues.createdAt)).limit(31),
            db.select().from(measuringSystem).orderBy(asc(measuringSystem.createdAt)).limit(31)
        ]);

        return { manual, system };
    },

    async getByUserId(userId) {

        const [manual, system] = await Promise.all([
            db.query.measuredValues.findMany({
                where: eq(measuredValues.userId, userId),
                orderBy: [asc(measuredValues.createdAt)],
                limit: 31
            }),
            db.query.measuringSystem.findMany({
                where: eq(measuringSystem.userId, userId),
                orderBy: [asc(measuringSystem.createdAt)],
                limit: 31
            })
        ]);

        return { manual, system };
    },


    async createManual(data) {
        return await db.insert(measuredValues).values(data).returning();
    },

    async createSystem(data) {
        return await db.insert(measuringSystem).values(data).returning();
    },

}