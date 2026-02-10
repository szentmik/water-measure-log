
import { addNewManualData, getAllMeasurements } from "$lib/server/controllers/measuresController";
import { json } from "@sveltejs/kit";

export const GET = async (event) => {
    try {
        const data = await getAllMeasurements(event);
        return json(data, { status: 200 });

    } catch (err) {
        if (err.message === "Unauthorized") return json({ error: "Unauthorized" }, { status: 401 });
        if (err.message === "Invalid month") return json({ error: "Invalid month" }, { status: 400 });
        if (err.message === "Invalid year") return json({ error: "Invalid year" }, { status: 400 });

        return json({ error: "Failed to get the data" }, { status: 500 });
    }
}

export const POST = async (event) => {
    try {
        const result = await addNewManualData(event);
        return json(result, { status: 201 });
    } catch (err) {
        if (err.message === "Unauthorized") return json({ error: "Unauthorized" }, { status: 401 });
        if (err.message === "Today already measured, not allowed to modify") return json({ error: "We have already values for today" }, { status: 409 });
        if (err.message === "Invalid numeric value") return json({ error: "Invalid numeric value" }, { status: 400 });

        console.error("Connection error", err);
        return json({ error: "Connection error." }, { status: 500 });
    }
}