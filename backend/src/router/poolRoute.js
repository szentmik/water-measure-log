import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { getManualData, getSystemData, postOrUpdateManData, postOrUpdateSysData } from "../controller/poolController.js";

const router = Router();


// GET secured
router.get("/manual", requireAuth(), getManualData);
// GET secured
router.get("/system", requireAuth(), getSystemData);
// POST / UPDATE manual secured
router.post("/manual/add", requireAuth(), postOrUpdateManData);
// POST / UPDATE system secured
router.post("/system/add", requireAuth(), postOrUpdateSysData);


export default router;