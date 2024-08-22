import express from "express";
import {
  getallGamesModel,
  getTeamModel,
  getGamesWithDetails,
} from "../controllers/client.js";
const router = express.Router();

router.get("/allgamesmodels", getallGamesModel);
router.get("/teammodels", getTeamModel);
router.get("/gamemodels", getGamesWithDetails);

export default router;
