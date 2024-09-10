import express from "express";
import GameModel from "../models/gameModel.js";

const router = express.Router();

router.post("/add-games", async (req, res) => {
  try {
    const games = req.body;
    if (!Array.isArray(games) || games.length === 0) {
      return res.status(400).json({ message: "Invalid game data" });
    }

    const bulkOperations = games.map((game) => ({
      updateOne: {
        filter: { "summary.id": game.summary.id },
        update: { $set: game },
        upsert: true,
      },
    }));
    await GameModel.bulkWrite(bulkOperations);
    res.status(201).json({ message: "Games uploaded/updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
