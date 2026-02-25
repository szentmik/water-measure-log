import { Router } from "express";
import { db } from "../db.js";
import { asc } from "drizzle-orm";
import { measuredValues, measuringSystem } from "../shema.js";
import { getAuth, requireAuth } from "@clerk/express";

const router = Router();


// GET secured
router.get("/manual", requireAuth(), async (req, res) => {
    try {
        const result = await db.select().from(measuredValues).orderBy(asc(measuredValues.createdAt)).limit(31);
        res.status(200).json(result);
    } catch (err) {
        console.log("Request error", err);
        res.status(500).json({ error: err || "Server error" });
    }
});
// GET secured
router.get("/system", requireAuth(), async (req, res) => {
    try {
        const result = await db.select().from(measuringSystem).orderBy(asc(measuringSystem.createdAt)).limit(31);
        res.status(200).json(result);
    } catch (err) {
        console.log("Request error", err);
        res.status(500).json({ error: err || "Server error" });
    }
});

// POST / UPDATE secured
router.post("/manual/add", requireAuth(), async (req, res) => {
    const { userId } = getAuth();
    const { phValue, chlorValue, totalClValue } = req.body;
    const gebClValue = totalClValue - chlorValue;

    try {

    } catch (err) {

    }
});


export default router;