import { Router } from "express";
const router = Router();

router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    if (userId != 1234) {
        return res.status(400).json({ error: "Undefined user" });
    }
    const userData = { name: "John Doe", age: "39" };

    try {

        const result = await userData;
        res.status(200).json({ ...result })

    } catch (err) {
        res.status(500).json({ error: err });
    }
    res.json({ username: "John Doe" });
});

router.post("create", async (req, res)=>{

});

export default router;