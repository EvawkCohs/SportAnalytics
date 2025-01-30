import userGameModel from "../models/userGameModel.js";

export const addUserGame = async (req, res) => {
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
};

export const findUserGames = async (req, res) => {
  const { gameId, userId } = req.query;

  if (!userId || !gameId) {
    return res
      .status(400)
      .json({ message: "gameID und userID sind erforderlich!" });
  }
  const gameIds = Array.isArray(gameId) ? gameId : [gameId];
  try {
    const games = await userGameModel.findOne({
      "summary.id": { $in: gameIds },
      userId,
    });

    return res.json(games);
  } catch (err) {
    console.error("Fehler beim Abrufen des Spiels: ", err);
    return res.status(500).json({ message: "Serverfehler" });
  }
};
