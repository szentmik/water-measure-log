import { getMeasurementsByUserId } from '$lib/server/controllers/measuresController'
import { json } from '@sveltejs/kit';

export const GET = async (event) => {
    try {
        const data = await getMeasurementsByUserId(event);
        return json(data);
    } catch (err) {
        if (err.message === "Unauthorized") return json({error: "Unauthorized"}, {status: 401});

        console.error("GET Error", err);
        return json({error: "Connection error"}, {status: 500});        
    }
}