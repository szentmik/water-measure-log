
import { addNewManualData, getAllMeasurements } from "$lib/server/controllers/measuresController";
import { json } from "@sveltejs/kit";

export const GET = async (event) => {
    try {
        const data = await getAllMeasurements(event);
        return json(data);

    } catch (err) {
        if (err.message === "Unauthorized") return json({ error: "You have to login" }, { status: 401 });
        if (err.message === "Invalid month") return json({ error: "Invalis month" }, { status: 400 });
        return json({ error: "Failed to get the data" }, { status: 500 });
    }
}

export const POST = async (event) => {
    try {
        const result = await addNewManualData(event);
        return json(result);
    } catch (err) {
        if (err.message === "Unauthorized") return json({ error: "Unauthorized" }, { status: 401 });
        if (err.message === "Today already measured, not allowed to modify") return json({ error: "We have already values for today" }, { status: 409 });
        return json({ error: "Connection failed." }, { status: 500 });
    }
}