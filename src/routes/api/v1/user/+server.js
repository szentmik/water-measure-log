import { getUserData } from "$lib/server/controllers/userController";
import { json } from "@sveltejs/kit";

export const GET = async (event) => {
    try {
        const userData = await getUserData(event);
        return json(userData);
    } catch (err) {
        if (err.message === "Unauthorized and inactive") {
            return json({ error: err.message }, { status: 401 });
        }

        console.error("Server failure at GET /api/v1/user:", err);
        return json({ error: "Server failure" }, { status: 500 });
    }
}