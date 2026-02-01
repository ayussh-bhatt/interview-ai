import express from "express";
import { verifyUser } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/verify", authenticate, verifyUser);

export default router;
