import express from "express";
import { postGameModel } from "../controllers/gameUpload.js";
const router = express.Router();

router.post("/add-games", postGameModel);

export default router;
