/** @format */

import express from "express";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Static public folder
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Hello World");
});

import GlobalRouter from "./routes/global.routes"
app.use("/api/v1", GlobalRouter);

export default app;
