import express from "express";
import {
  startInterview,
  finishInterview,
  getInterviewReview,
} from "../controllers/interviewController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { syncUser } from "../middleware/syncUserMiddleware.js";

const router = express.Router();

// Start interview
router.post(
  "/start",
  authenticate,
  syncUser,
  startInterview
);

// Finish interview
router.post(
  "/finish",
  authenticate,
  syncUser,
  finishInterview
);

// Interview review
router.get(
  "/:sessionId/review",
  authenticate,
  syncUser,
  getInterviewReview
);

export default router;
