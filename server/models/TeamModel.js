import mongoose from "mongoose";

const TeamModelSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    urlEnding: String,
    group: String,
    logo: String,
  },
  { timestamps: false }
);

const TeamModel = mongoose.model("TeamModel", TeamModelSchema);
export default TeamModel;
