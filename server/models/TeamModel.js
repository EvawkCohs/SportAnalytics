import mongoose from "mongoose";

const TeamModelSchema = new mongoose.Schema(
  {
    id: { type: String, index: true },
    name: String,
    urlEnding: String,
    group: String,
    logo: String,
    gender: String,
    season: String,
    lastGamesSyncAt: { type: Date, default: null },
  },
  { timestamps: false }
);
TeamModelSchema.index({ id: 1 });

const TeamModel = mongoose.model("TeamModel", TeamModelSchema);
export default TeamModel;
