import express from "express";
import {
  submitVideoResponse,
  submitTextResponse,
} from "../controllers/responseController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { syncUser } from "../middleware/syncUserMiddleware.js";

const router = express.Router();

router.post("/video", authenticate, syncUser, submitVideoResponse);
router.post("/text", authenticate, syncUser, submitTextResponse);

export default router;
