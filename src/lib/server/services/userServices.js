import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const userService = {
    async getById(id) {
        return await db.query.users.findFirst({
            where: eq(users.id, id),
            with: {
                measurements: true
            }
        });
    },

    async upsert(userData) {
        return await db.insert(users).values(userData).onConflictDoUpdate({
            target: users.id,
            set:{
                name: userData.name,
                email: userData.email,
                imageUrl: userData.imageUrl
            }
        }).returning();
    }
}