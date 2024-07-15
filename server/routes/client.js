import express from "express";
import { getallGamesModel, getTeamModel } from "../controllers/client.js";
const router = express.Router();

router.get("/allgamesmodels", getallGamesModel);
router.get("/teammodels", getTeamModel);

export default router;
