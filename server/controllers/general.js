import TeamModel from "../models/TeamModel.js";

export const getTeam = async (req, res) => {
  try {
    const team = await TeamModel.findOne({ id: req.params.id });
    res.status(200).json(team);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
