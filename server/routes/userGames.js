import express from "express";
import { addUserGame, findUserGames } from "../controllers/userGames.js";

const router = express.Router();

router.post("/add-userGame", addUserGame);
router.get("/findUserGames", findUserGames);

export default router;
