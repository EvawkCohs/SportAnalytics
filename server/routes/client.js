import express from "express";
import { getallGamesModel } from "../controllers/client.js";
const router = express.Router();

router.get("/allgamesmodels", getallGamesModel);
export default router;
