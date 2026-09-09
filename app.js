import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/database.js";

// 🔥 ROUTES
import userRoute from "./routes/userRoutes.js";
import taskRoute from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

// 🔐 MIDDLEWARES
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            process.env.FRONTEND_URL
        ].filter(Boolean),
        credentials: true
    })
);

app.use(express.json());

// 🏠 ROOT
app.get("/", (req, res) => {
    res.json({
        message: "🚀 POS + CRM Server Running"
    });
});

// 📦 API ROUTES
app.use("/api/user", userRoute);
app.use("/api/task", taskRoute);

// 🔌 CONNECT DATABASE
let isConnected = false;

const connectDatabase = async () => {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
        console.log("☑️ Database Connected");
    }
};

// 🚀 VERCEL SERVERLESS FUNCTION
export default async function handler(req, res) {
    try {
        await connectDatabase();
        return app(req, res);
    } catch (error) {
        console.error("❌ Serverless function error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}