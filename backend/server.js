import "dotenv/config";
import express from "express";
import userRoute from "./src/router/userRoute.js";
import poolRoute from "./src/router/poolRoute.js";
import { clerkMiddleware } from '@clerk/express';

const app = express();
const port = 3000;

app.use(clerkMiddleware());
app.use("/user", userRoute);
app.use("/api/v1/measurements", poolRoute);

app.get("/", (req, res)=>{
    res.send("Hello world");
});

app.listen(port, ()=>{
    console.log(`The server is running on port: ${port}`);
})

