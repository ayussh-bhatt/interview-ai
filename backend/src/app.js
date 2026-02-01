import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import responseRoutes from "./routes/responseRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

import { authenticate } from "./middleware/authMiddleware.js";
import { syncUser } from "./middleware/syncUserMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes (AUTH + USER SYNC)
app.use("/api/profile", authenticate, syncUser, profileRoutes);
app.use("/api/interview", authenticate, syncUser, interviewRoutes);
app.use("/api/response", authenticate, syncUser, responseRoutes);
app.use("/api/analytics", authenticate, syncUser, analyticsRoutes);

export default app;
