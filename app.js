import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import config from "./config/config.js";

// 🔥 ROUTES
import userRoute from "./routes/userRoutes.js";
import taskRoute from "./routes/taskRoutes.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = config.port || 5000;

// 🔐 MIDDLEWARES
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

// 🏠 ROOT
app.get("/", (req, res) => {
    res.json({ message: "🚀 POS + CRM Server Running" });
});

// 📦 API ROUTES
app.use("/api/user", userRoute);
app.use("/api/task", taskRoute);

// [http://localhost:5000/api/user/signin]
// [http://localhost:5000/api/user/signup]
// [http://localhost:5000/api]

const startServer = async () => {
    try {
        await connectDB();
        console.log("☑️ Database Connected");

        app.listen(PORT, () => {
            console.log(`☑️ Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();