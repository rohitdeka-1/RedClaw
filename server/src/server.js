import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import { connectDb } from "./database/db.js";
import envConfig from './config/env.config.js';
import { startCleanupJob } from './jobs/cleanupUnverified.js';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173" ,"https://red-claw.vercel.app", "http://127.0.0.1:5173"],
    credentials: true,
}));


app.get("/health-check", (req, res) => {
    res.send("API is running...");
});

// Routes
app.use("/api/v1", router);



connectDb().then(() => {
    // Start cleanup job after database connection
    startCleanupJob();
    
    app.listen(PORT, () => {
        console.log(`Server running : http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
});