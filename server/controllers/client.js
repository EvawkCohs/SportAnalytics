import allGamesModel from "../models/allgamesmodel.js";

export const getallGamesModel = async (req, res) => {
  try {
    const gameIds = await allGamesModel.find();

    res.status(200).json(gameIds);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
