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

//Scrape IMPORT
import scrapeAllGames, { overalldata } from "./scrapeModels/scrapeAllGames.js";

//MODEL IMPORTS
import gameModel from "./models/gameModel.js";
import allGamesModel from "./models/allGamesModel.js";

//CONFIGURATION
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//ROUTES SETUP
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);

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
  })
  .catch((error) => console.log(`${error} did not connect`));

//SCRAPE DATA
//scrapeAllGames();
