import express from "express";
import { getDashboardAnalytics } from "../controllers/analyticsController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { syncUser } from "../middleware/syncUserMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  authenticate,
  syncUser,
  getDashboardAnalytics
);

export default router;
