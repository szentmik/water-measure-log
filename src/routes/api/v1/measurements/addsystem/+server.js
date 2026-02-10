import { addNewSystemData } from '$lib/server/controllers/measuresController'
import { json } from '@sveltejs/kit';

export const POST = async (event) => {
    try {
        const result = await addNewSystemData(event);
        return json(result);
    } catch (err) {
        if (err.message === "Unauthorized") return json({error: "Unauthorized"}, {status: 401});
        if (err.message === "Today every values were added") return json({error: "Today every values were added"}, {status: 409})

        console.error("Connection error", err);
        return json({error: "Connection error"}, {status: 500});
        
    }
}