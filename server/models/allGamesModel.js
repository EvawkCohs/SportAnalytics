import mongoose from "mongoose";

const allgamesmodelSchema = new mongoose.Schema({
  id: String,
  tournament: {
    id: String,
  },
});

const allgamesmodel = mongoose.model("allgamesmodel", allgamesmodelSchema);
export default allgamesmodel;
