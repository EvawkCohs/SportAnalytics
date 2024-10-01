import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

//ROUTE IMPORTS
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import gameUploadRoutes from "./routes/gameUpload.js";
import gameUploadCheckRoutes from "./routes/gameUploadCheck.js";

//MODEL IMPORTS
// import gameModel from "./models/gameModel.js";
// import allGamesModel from "./models/allgamesmodel.js";
// import TeamModel from "./models/TeamModel.js";

//DATA IMPORT
import { dataTeams } from "./data/teams.js";
//CONFIGURATION
dotenv.config();
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//ROUTES SETUP
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/gameUpload", gameUploadRoutes);
app.use("/gameUploadCheck", gameUploadCheckRoutes);

//MONGOOSE SETUP
const PORT = process.env.PORT || 9000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    //DATA UPLOAD
    //gameModel.insertMany(overalldata);
    //allGamesModel.insertMany(overalldata);
    //TeamModel.insertMany(dataTeams);
  })
  .catch((error) => console.log(`${error} did not connect`));
