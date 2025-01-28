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
import userRoutes from "./routes/userRoutes.js";

//MODEL IMPORTS
// import gameModel from "./models/gameModel.js";
// import allGamesModel from "./models/allgamesmodel.js";
//import TeamModel from "./models/TeamModel.js";

//DATA IMPORT
//import { dataTeams } from "./data/teams.js";
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
app.use("/users", userRoutes);

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
app.get("/proxy", async (req, res) => {
  const { url } = req.query; // URL aus den Query-Parametern holen

  if (!url) {
    return res.status(400).send("Fehlende URL");
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType.includes("application/json")) {
      const data = await response.json();
      res.json(data);
    } else if (contentType.includes("text/csv")) {
      const data = await response.text();
      res.header("Content-Type", "text/csv");
      res.send(data);
    } else if (contentType.includes("text/html")) {
      const data = await response.text();
      res.header("Content-Type", "text/html");
      res.send(data);
    } else {
      throw new Error("Unsupported content type: " + contentType);
    }
  } catch (error) {
    res.status(500).send("Fehler beim Abrufen der Daten: " + error.message);
  }
});
