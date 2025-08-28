import express from "express";
import {
  getTeamModel,
  getGamesWithDetails,
  getGamesWithParticipation,
  getTeamSchedule,
  getGameIDs,
  getAllGamesDetails,
} from "../controllers/client.js";
const router = express.Router();

router.get("/teammodels", getTeamModel);
router.get("/gamemodels/details", getGamesWithDetails);
router.get("/gamemodels/participation", getGamesWithParticipation);
router.get("/teamschedule", getTeamSchedule);
router.get("/gameids", getGameIDs);
router.get("/allgamesdetails", getAllGamesDetails);

export default router;
