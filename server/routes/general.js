import express from "express";
import { getTeam } from "../controllers/general.js";

const router = express.Router();

router.get("/teammodels/:id", getTeam);
export default router;
