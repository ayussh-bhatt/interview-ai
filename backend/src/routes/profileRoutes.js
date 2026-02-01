import express from "express";
import { upsertUserProfile } from "../controllers/profileController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { syncUser } from "../middleware/syncUserMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  syncUser,
  upsertUserProfile
);

export default router;
