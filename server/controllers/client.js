import allGamesModel from "../models/allgamesmodel.js";
import TeamModel from "../models/TeamModel.js";
import GameModel from "../models/gameModel.js";

export const getallGamesModel = async (req, res) => {
  try {
    const gameIds = await allGamesModel.find();

    res.status(200).json(gameIds);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTeamModel = async (req, res) => {
  try {
    const teamIds = await TeamModel.find();
    res.status(200).json(teamIds);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGameModel = async (req, res) => {
  const gameId = req.query.id;
  try {
    const game = await GameModel.findOne({ "summary.id": gameId });
    if (game) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error checking the game", error });
  }
};
