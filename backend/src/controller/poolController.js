import { asc, between, eq } from "drizzle-orm";
import { db } from "../db.js";
import { measuredValues } from "../schema.js";
import { getByMonth, getTodayRange, toNumber } from "../lib/myHelpers.js";
import { getAuth } from "@clerk/express";


// GET manual measurements
export const getManualData = async (req, res) => {
    try {
        const { year, month } = req.query;
        const { firstDay, lastDay } = getByMonth(year, month);

        const result = await db.query.measuredValues.findMany({
            where: between(measuredValues, firstDay, lastDay),
            with: {
                user: true
            },
            orderBy: [asc(measuredValues.createdAt)],
            limit: 31
        });

        res.status(200).json(result);
    } catch (err) {
        console.log("Request error", err);
        res.status(500).json({ error: err || "Server error" });
    }
}

// GET system data

export const getSystemData = async (req, res) => {
    try {
        const result = await db.select().from(measuringSystem).orderBy(asc(measuringSystem.createdAt)).limit(31);
        res.status(200).json(result);
    } catch (err) {
        console.log("Request error", err);
        res.status(500).json({ error: err || "Server error" });
    }
}

// POST or UPDATE manual measurements
export const postOrUpdateData = async (req, res) => {
    const { start, end } = getTodayRange();
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized." });
    }

    try {
        const phValue = toNumber(req.body.phValue);
        const chlorValue = toNumber(req.body.chlorValue);
        const totalClValue = toNumber(req.body.totalClValue);

        if (phValue === "ERROR" || chlorValue === "ERROR" || totalClValue === "ERROR") {
            return res.status(400).json({ error: "Invalid number." })
        }

        const [existing] = await db.select().from(measuredValues)
            .where(between(measuredValues.createdAt, start, end)).limit(1);

        if (!existing) {

            const [newRecord] = await db.insert(measuredValues)
                .values({
                    phValue,
                    chlorValue,
                    totalClValue,
                    gebClValue: (totalClValue !== null && chlorValue !== null)
                        ? totalClValue - chlorValue
                        : null,
                    userId
                })
                .returning();
            return res.status(201).json(newRecord);
        }

        const isComplete = existing.phValue !== null &&
            existing.chlorValue !== null &&
            existing.totalClValue !== null;

        if (isComplete) {
            return res.status(409).json({ error: "Today already everything is measured." });
        }

        const finalPh = existing.phValue ?? phValue;
        const finalCl = existing.chlorValue ?? chlorValue;
        const finalTotalCl = existing.totalClValue ?? totalClValue;

        const finalGeb = (finalTotalCl !== null && finalCl !== null)
            ? Number((finalTotalCl - finalCl).toFixed(2))
            : null;

        const [updateRecord] = await db.update(measuredValues)
            .set({
                phValue: finalPh,
                chlorValue: finalCl,
                totalClValue: finalTotalCl,
                gebClValue: finalGeb,
                updatedBy: userId,
            })
            .where(eq(measuredValues.id, existing.id))
            .returning();

        res.status(200).json(updateRecord);

    } catch (err) {
        console.log("Server error", err);
        res.status(500).json({ error: "Server connection error." });
    }
}