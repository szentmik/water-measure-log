import { json } from "@sveltejs/kit";
import { measureServices } from "../services/measureServices";

export const getAllMeasurements = async ({ url, locals }) => {
    try {
        const year = parseInt(url.searchParams.get("year")) || new Date().getFullYear();
        const month = parseInt(url.searchParams.get("month")) || new Date().getMonth() + 1;

        const userId = (await locals.auth())?.userId;
        if (!userId) return json({ error: "Unauthorized" }, { status: 401 });

        const result = await measureServices.getComparisonDataByMonth(year, month);

        return json(result, { status: 200 });

    } catch (err) {
        console.error("Request failed", err);

        return json({ error: "Connection error" }, { status: 500 });
    }
};

export const getMeasurementsByUserId = async ({ locals }) => {
    try {
        const userId = (await locals.auth())?.userId;
        if (!userId) return json({ error: "Unauthorized" }, { status: 401 });

        const result = await measureServices.getByUserId(userId);

        return json(result, { status: 200 });

    } catch (err) {
        console.error("Request failed", err);
        return json({ error: "Connection error" }, { status: 500 });
    }
};

export const addNewManualData = async ({ request, locals }) => {
    try {
        const userId = (await locals.auth())?.userId;
        if (!userId) return json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const phValue = body.phValue != null ? Number(body.phValue) : null;
        const chlorValue = body.chlorValue != null ? Number(body.chlorValue) : null;
        const totalClValue = body.totalClValue != null ? Number(body.totalClValue) : null;
        let gebClValue = null;

        if (chlorValue !== null && totalClValue !== null) {
            gebClValue = Number((totalClValue - chlorValue).toFixed(2));
        }

        const data = {
            phValue,
            chlorValue,
            totalClValue,
            gebClValue,
        }

        const result = await measureServices.upsertManual(data, userId);

        return json(result);

    } catch (err) {
        console.error(err.message);
        return json({ error: err.message }, { status: 400 });
    }
};

export const addNewSystemData = async ({ request, locals }) => {
    try {
        const userId = (await locals.auth())?.userId;
        if (!userId) return json({ error: "Unauthorized" }, { status: 401 });
        const body = await request.json();

        const phValue = body.sysPhValue ? Number(body.sysPhValue) : null;
        const chlorValue = body.sysChlorValue ? Number(body.sysChlorValue) : null;
        const redoxValue = body.sysRedoxValue ? Number(body.sysRedoxValue) : null;
        const waterTemp = body.sysWaterTemp ? Number(body.sysWaterTemp) : null;
        const flow = body.sysFlow ? Number(body.sysFlow) : null;
        const filterBackwash = body.sysFilterBackwash === true || body.sysFilterBackwash ==="true";

        const data = {
            phValue,
            chlorValue,
            redoxValue,
            waterTemp,
            flow,
            filterBackwash,
            userId,
        }

        const result = await measureServices.insertSystem(data);

        return json(result);

    } catch (err) {
        console.error(err.message);
        return json({ error: err.message }, { status: 400 });
    }
};