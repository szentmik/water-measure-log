import { db } from "../db";
import { eq, asc, between } from "drizzle-orm";
import { measuredValues, measuringSystem } from "../db/schema";

const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

export const measureServices = {
    async getComparisonData() {
        const [manual, system] = await Promise.all([
            db.select().from(measuredValues).orderBy(asc(measuredValues.createdAt)).limit(31),
            db.select().from(measuringSystem).orderBy(asc(measuringSystem.createdAt)).limit(31)
        ]);

        return { manual, system };
    },

    async getComparisonDataByMonth(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const [manual, system] = await Promise.all([
            db.query.measuredValues.findMany({
                where: between(measuredValues.createdAt, startDate, endDate),
                with: {
                    user: true,
                    updatedByUser: true,
                },
                orderBy: [asc(measuredValues.createdAt)],

            }),
            db.query.measuringSystem.findMany({
                where: between(measuringSystem.createdAt, startDate, endDate),
                with: {
                    user: true,
                    updatedByUser: true,
                },
                orderBy: [asc(measuringSystem.createdAt)],
            })
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

    async upsertManual(data, currentUserId) {
        const { start, end } = getTodayRange();

        // 1. check if exists
        const existing = await db.query.measuredValues.findFirst({
            where: between(measuredValues.createdAt, start, end),
        });

        if (existing) {

            const isComplete = existing.chlorValue !== null &&
                existing.phValue !== null &&
                existing.totalClValue !== null;

            if (isComplete) {
                throw new Error("Today already measured, not allowed to modify");
            }

            // 2. Update
            return await db.update(measuredValues)
                .set({
                    ...data,
                    updatedBy: currentUserId,
                })
                .where(eq(measuredValues.id, existing.id))
                .returning();
        } else {
            // 3. Insert
            return await db.insert(measuredValues)
                .values({
                    ...data,
                    userId: currentUserId,
                    updatedBy: currentUserId,
                })
                .returning();
        }
    },

    async insertSystem(data) {
        const { start, end } = getTodayRange();


        const existing = await db.query.measuringSystem.findFirst({
            where: between(measuringSystem.createdAt, start, end),
        });

        if (existing) throw new Error("Today every values were added");

        return await db.insert(measuringSystem).values({
            ...data,
            updatedBy: data.userId,
        }).returning();
    },
}