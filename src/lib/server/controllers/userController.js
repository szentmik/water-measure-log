import { json, error } from "@sveltejs/kit";
import { userService } from "../services/userServices";

export const syncUser = async ({ request, locals }) => {
    try {
        const userId = (await locals.auth())?.userId;
        
        if (!userId) return json({ error: "Unauthorized" }, { status: 401 });

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
            id:userId,
            name,
            email,
            imageUrl
        });

        return json(user, {status: 201});


    } catch (err) {
        console.error("Connection failed", err);
        return json({error:"Connection error"}, {status:500});
    }
};