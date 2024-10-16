/** @format */

import express from "express";
import cors from "cors";

const app = express();

// List of allowed origins
const allowedOrigins = ["http://localhost:3000", "https://www.avyuktsolutions.com/"];

// CORS options to allow multiple origins
const corsOptions = {
    origin: allowedOrigins, // Directly passing array of allowed origins
    methods: "GET,POST", // Allow only specific methods
};

// Middleware to parse JSON bodies
app.use(express.text({ type: 'text/plain' }));
app.use(express.json());

// Static public folder
app.use(express.static("public"));

// Applying CORS to specific routes
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Apply CORS to /api/v1 routes only with multiple origins
import GlobalRouter from "../routes/global.routes";
app.use("/api/v1", cors(corsOptions), GlobalRouter);

export default app;
