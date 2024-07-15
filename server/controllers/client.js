import allGamesModel from "../models/allgamesmodel.js";
import TeamModel from "../models/TeamModel.js";

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
