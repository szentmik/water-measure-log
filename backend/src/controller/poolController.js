import { asc, between, eq } from "drizzle-orm";
import { db } from "../db.js";
import { measuredValues, measuringSystem } from "../schema.js";
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
        const { year, month } = req.query;
        const { firstDay, lastDay } = getByMonth(year, month);

        const result = await db.query.measuringSystem.findMany({
            where: between(measuringSystem, firstDay, lastDay),
            with: {
                user: true
            },
            orderBy: [asc(measuringSystem.createdAt)],
            limit: 31
        });
        res.status(200).json(result);
    } catch (err) {
        console.log("Request error", err);
        res.status(500).json({ error: err || "Server error" });
    }
}

// POST or UPDATE manual measurements
export const postOrUpdateManData = async (req, res) => {
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

// POST or UPDATE system data.

export const postOrUpdateSysData = async (req, res) => {
    const { start, end } = getTodayRange();
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized." });
    }

    try {
        const phValue = toNumber(req.body.phValue);
        const chlorValue = toNumber(req.body.chlorValue);
        const redoxValue = toNumber(req.body.redoxValue);
        const waterTemp = toNumber(req.body.waterTemp);
        const flow = toNumber(req.body.flow);
        const filterBackwash = req.body.filterBackwash;

        if (phValue === "ERROR" ||
            chlorValue === "ERROR" ||
            redoxValue === "ERROR" ||
            waterTemp === "ERROR" ||
            flow === "ERROR"
        ) {
            return res.status(400).json({ error: "Invalid number." });
        }

        const [existing] = await db.select().from(measuringSystem)
            .where(between(measuringSystem.createdAt, start, end)).limit(1);

        if (!existing) {
            const [newRecord] = await db.insert(measuringSystem).values({
                phValue,
                chlorValue,
                redoxValue,
                waterTemp,
                flow,
                filterBackwash,
                userId
            }).returning();

            return res.status(201).json(newRecord);
        }

        const isComplete = existing.phValue !== null &&
            existing.chlorValue !== null &&
            existing.redoxValue !== null &&
            existing.waterTemp !== null &&
            existing.flow !== null &&
            existing.filterBackwash !== null;

        if (isComplete) {
            return res.status(409).json({ error: "Today all fields are completed." });
        }

        const finalPh = existing.phValue ?? phValue;
        const finalCl = existing.chlorValue ?? chlorValue;
        const finalRedox = existing.redoxValue ?? redoxValue;
        const finalTemp = existing.waterTemp ?? waterTemp;
        const finalFlow = existing.flow ?? flow;
        const finalBackwash = existing.filterBackwash ?? filterBackwash;

        const [updateRecord] = await db.update(measuringSystem).set({
            phValue: finalPh,
            chlorValue: finalCl,
            redoxValue: finalRedox,
            waterTemp: finalTemp,
            flow: finalFlow,
            filterBackwash: finalBackwash,
            updatedBy: userId,
        })
            .where(eq(measuringSystem.id, existing.id))
            .returning();

        res.status(200).json(updateRecord);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server connection error." })
    }
}