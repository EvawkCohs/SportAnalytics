import express from "express";
import {
  addUserGame,
  findUserGames,
  updatePlayer,
} from "../controllers/userGames.js";

const router = express.Router();

router.post("/add-userGame", addUserGame);
router.get("/findUserGames", findUserGames);
router.post("/updatePlayer", updatePlayer);

export default router;
