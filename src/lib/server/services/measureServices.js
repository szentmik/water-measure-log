import { db } from "../db";
import { eq, desc } from "drizzle-orm";
import { measuredValues } from "../db/schema";

export const measureServices = {
    async getAll() {
        return await db.select().from(measuredValues).orderBy(desc(measuredValues.createdAt));
    },

    async getByUserId(userId){
        return await db.query.measuredValues.findMany({
            where: eq(measuredValues.userId, userId),
            orderBy: [desc(measuredValues.createdAt)],
        })
    },
    async create(data){
        return await db.insert(measuredValues).values(data).returning();
    }
}