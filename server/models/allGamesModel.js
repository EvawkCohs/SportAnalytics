import mongoose from "mongoose";

const allGamesModelSchema = new mongoose.Schema({
  id: String,
  tournament: {
    id: String,
  },
});

const allGamesModel = mongoose.model("allGamesModel", allGamesModelSchema);
export default allGamesModel;
