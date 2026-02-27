import { Router } from "express";
import { db } from "../db.js";
import { users } from "../schema.js";
import { getAuth } from "@clerk/express";

const router = Router();


//  UPSERT user 
router.post("/sync", async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { email, name, imageUrl } = req.body;
        if (!email || !name) {
            return res.status(400).json({ error: "Email, name are required." });
        }

        const newUser = {
            id: userId,
            email,
            name,
            imageUrl
        }

        const [result] = await db.insert(users)
            .values(newUser)
            .onConflictDoUpdate({
                target: users.id,
                set: {
                    email,
                    name,
                    imageUrl
                }
            }).returning();

        if (!result) {
            return res.status(404).json({ error: "Save failed." })
        }

        res.status(200).json(result);

    } catch (err) {
        console.log("Request error", err);
        res.status(500).json({ error: err || "Server error." });
    }
});

export default router;