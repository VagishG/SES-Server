/** @format */

import express from "express";

const app = express();

// Middleware to parse JSON bodies
app.use((req, res, next) => {
    if (req.headers['content-type'] === 'text/plain') {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            try {
                req.body = JSON.parse(data);
            } catch (e) {
                req.body = data;
            }
            next();
        });
    } else {
        next();
    }
});

app.use(express.json());

// Static public folder
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Hello World");
});

import GlobalRouter from "../routes/global.routes"
app.use("/api/v1", GlobalRouter);

export default app;
