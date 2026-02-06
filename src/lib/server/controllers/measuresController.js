import { json, error } from "@sveltejs/kit";
import { measureServices } from "../services/measureServices";

export const getAllMeasurements = async ({ locals }) => {
    try {

        const userId = locals.auth()?.userId;
        if (!userId) return json({ error: "Umauthorized" }, { status: 401 });

        const result = await measureServices.getAll();

        return json(result, { status: 200 });

    } catch (err) {
        console.error("Request failed", err);

        return json({ error: "Connection error" }, { status: 500 });
    }
};

export const getMeasurementsByUserId = async ({ request, locals }) => {
    try {
        const userId = locals.auth()?.userId;
        if(!userId) return json({error: "Unauthorized"}, {status:401});

        const result = await measureServices.getByUserId(userId);

        return json(result,{status:200});

    } catch (err) {
        console.error("Request failed", err);
        return json({error: "Connection error"}, {status: 500});        
    }
}