import express from "express";

import { authenticateToken } from "../middleware/authMiddleware.js";
import { getProfile, login, register } from "../controllers/user.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticateToken, getProfile);

export default router;
