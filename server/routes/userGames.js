import express from "express";
import userGameModel from "../models/userGameModel.js";

const router = express.Router();

router.post("/add-userGame", async (req, res) => {
  try {
    const { userId, summary, lineup, events } = req.body;
    const newUserGameModel = await userGameModel.findOneAndUpdate(
      {
        userId,
        "summary.id": summary.id,
      },
      { summary, lineup, events },
      { new: true, upsert: true }
    );

    await newUserGameModel.save();
    res.status(201).json(newUserGameModel);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Speichern der Daten" });
  }
});

router.get("/find-Game", async (req, res) => {
  const { gameId, userId } = req.query;

  if (!userId || !gameId) {
    return res
      .status(400)
      .json({ message: "gameID und userID sind erforderlich!" });
  }

  try {
    const game = await userGameModel.findOne({ "summary.id": gameId, userId });
    if (!game) {
      return res
        .status(404)
        .json({ message: "Keine Nutzerspezifischen Daten gefunden" });
    }
    return res.json(game);
  } catch (err) {
    console.error("Fehler beim Abrufen des Spiels: ", err);
    return res.status(500).json({ message: "Serverfehler" });
  }
});

export default router;
