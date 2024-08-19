import express from "express";
import { getGameModel } from "../controllers/client.js";

const router = express.Router();
router.get("/gamemodels", getGameModel);

export default router;
