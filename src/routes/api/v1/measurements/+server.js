import { measureServices } from "$lib/server/services/measureServices";
import { json } from "@sveltejs/kit";

export const GET = async () => {
    try {
        const data = await measureServices.getAll();
        return json(data);

    } catch (error) {
        console.error("Failed to get the data", error);
        return json({ error: "Failed to get th data" }, { status: 500 });
    }
}
