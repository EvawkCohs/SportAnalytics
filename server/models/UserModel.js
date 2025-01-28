import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  vorname: { type: String, required: true },
  nachname: { type: String, required: true },
  strasse: { type: String, required: true },
  plz: { type: String, required: true },
  stadt: { type: String, required: true },
  mannschaft: { type: String, required: true },
});

export default mongoose.model("User", UserSchema);
