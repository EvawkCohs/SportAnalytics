import express from "express";
import {
  getTeamModel,
  getGamesWithDetails,
  getGamesWithParticipation,
} from "../controllers/client.js";
const router = express.Router();

//router.get("/allgamesmodels", getallGamesModel);
router.get("/teammodels", getTeamModel);
router.get("/gamemodels/details", getGamesWithDetails);
router.get("/gamemodels/participation", getGamesWithParticipation);

export default router;
