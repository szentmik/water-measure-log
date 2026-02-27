import "dotenv/config";
import express from "express";
import userRoute from "./src/router/userRoute.js";
import poolRoute from "./src/router/poolRoute.js";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express';

const app = express();
const port = 3000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(clerkMiddleware());
app.use("/user", userRoute);
app.use("/api/v1/measurements", poolRoute);

app.get("/", (req, res) => {
     
    res.send(start + end);
});

app.listen(port, () => {
    console.log(`The server is running on port: ${port}`);
})

