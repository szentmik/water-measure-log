import { Router } from "express";
import { db } from "../db.js";
import { asc } from "drizzle-orm";
import { measuringSystem } from "../schema.js";
import { requireAuth } from "@clerk/express";
import { getManualData, postOrUpdateData } from "../controller/poolController.js";

const router = Router();


// GET secured
router.get("/manual", requireAuth() ,getManualData);
// GET secured
router.get("/system", requireAuth(), );

// POST / UPDATE secured
router.post("/manual/add", requireAuth(), postOrUpdateData);


export default router;