import { syncUser } from "$lib/server/controllers/userController.js";


export const POST = async (event) => {
    return await syncUser(event);
}