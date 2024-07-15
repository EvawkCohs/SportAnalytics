import mongoose from "mongoose";

const TeamModelSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
  },
  { timestamps: true }
);

const TeamModel = mongoose.model("TeamModel", TeamModelSchema);
export default TeamModel;
