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

export const updatePlayer = async (req, res) => {
  try {
    const { userId, player } = req.body;
    const updateGame = await userGameModel.findOneAndUpdate(
      {
        userId,
        "summary.id": player.gameId,
        $or: [{ "lineup.home.id": player.id }, { "lineup.away.id": player.id }],
      },
      { $set: { "lineup.home.$": player, "lineup.away.$": player } }
    );

    if (updateGame.modifiedCount > 0) {
      return res
        .status(200)
        .json({ message: "Spieler erfolgreich aktualisiert" });
    } else {
      return res.status(404).json({ message: "Spieler nicht gefunden" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Serverfehler" });
  }
};
