import { addNewSystemData } from '$lib/server/controllers/measuresController'
import { json } from '@sveltejs/kit';

export const POST = async (event) => {
    try {
        const result = await addNewSystemData(event);
        return json(result, {status: 201});
    } catch (err) {
        if (err.message === "Unauthorized") return json({error: "Unauthorized"}, {status: 401});
        if (err.message === "Invalid numeric value") return json({error: "Invalid numeric value"}, {status:400});
        if (err.message === "Today every values were added") return json({error: "We have already values for today"}, {status: 409})

        console.error("Connection error", err);
        return json({error: "Connection error"}, {status: 500});
        
    }
}