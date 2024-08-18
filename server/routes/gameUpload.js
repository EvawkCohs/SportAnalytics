import express from "express";
import GameModel from "../models/gameModel.js";

const router = express.Router();

router.post("/add-game", async (req, res) => {
  try {
    const gameData = req.body;
    if (!gameData || typeof gameData !== "object") {
      return res.status(400).json({ message: "Invalid game data" });
    }

    await GameModel.insertMany(gameData);

    res.status(201).json({ message: "Game added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
