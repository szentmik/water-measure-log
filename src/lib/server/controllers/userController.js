import { json, error } from "@sveltejs/kit";
import { userService } from "../services/userServices";

export const syncUser = async ({ request, locals }) => {
    try {
        const session = await locals.auth();
        const userId = session?.userId;
        const userStatus = session?.sessionStatus;

        if (!userId || userStatus !== "active") {
            return json({ error: "Unauthorized and inactive" }, { status: 401 })
        };

        const body = await request.json();
        const { name, email, imageUrl } = body;

        if (!name || !email || !imageUrl) {
            return json({
                error: "Missing fields",
                missing: {
                    name: !name,
                    email: !email,
                    imageUrl: !imageUrl
                }
            }, { status: 400 });
        }

        const user = await userService.upsert({
            id: userId,
            name,
            email,
            imageUrl
        });

        return json(user, { status: 201 });


    } catch (err) {
        console.error("Connection failed", err);
        return json({ error: "Connection error" }, { status: 500 });
    }
};

export const getUserData = async ({ locals }) => {
    const session = await locals.auth();
    const userId = session?.userId;
    const userStatus = session?.sessionStatus;

    if (!userId || userStatus !== "active") throw new Error("Unauthorized and inactive");

    return await userService.getById(userId);
};