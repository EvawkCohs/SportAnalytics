import TeamModel from "../models/TeamModel.js";
import GameModel from "../models/gameModel.js";
import axios from "axios";
import Papa from "papaparse";
import { load } from "cheerio";

export const getTeamModel = async (req, res) => {
  try {
    const teamIds = await TeamModel.find();
    res.status(200).json(teamIds);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGameModel = async (req, res) => {
  const gameId = req.query.id;

  try {
    const game = await GameModel.findOne({ "summary.id": gameId });
    if (game) {
      res.json(game);
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error checking the game", error });
  }
};

export const getGamesWithDetails = async (req, res) => {
  const gameIds = req.query.ids ? req.query.ids.split(",") : [];
  const results = [];

  try {
    for (const gameId of gameIds) {
      // Spiel in der Datenbank suchen
      let game = await GameModel.findOne({ "summary.id": gameId });

      if (!game) {
        results.push({ id: gameId, exists: false });
      } else {
        results.push(game);
      }
    }

    // Rückgabe des Ergebnisses
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching game details", error });
  }
};

export const getGamesWithParticipation = async (req, res) => {
  const teamId = req.query.id;
  try {
    const gamesWithParticipation = await GameModel.find({
      $or: [
        { "summary.homeTeam.id": teamId },
        { "summary.awayTeam.id": teamId },
      ],
    });
    const uniqueGames = Array.from(
      new Map(
        gamesWithParticipation.map((game) => [game.summary.id, game])
      ).values()
    );
    res.status(200).json(uniqueGames);
  } catch (error) {
    console.error("Spiele konnten nicht gefunden werden: ", error);
    throw new Error("Spiele konnten nicht gefunden werden!");
  }
};

export const getTeamSchedule = async (req, res) => {
  const { teamId } = req.query;
  const url = `https://www.handball.net/a/sportdata/1/teams/${teamId}/team-schedule.csv?`;
  try {
    const response = await axios.get(url);
    Papa.parse(response.data, {
      header: true,
      complete: (results) => {
        res.status(200).json(results.data);
      },
      error: (error) => {
        res
          .status(500)
          .json({ message: "Fehler beim Parsen der CSV-Daten", error });
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fehler beim Abrufen der CSV-Daten", error });
  }
};

export const getGameIDs = async (req, res) => {
  const { teamId } = req.query;
  const url = `https://www.handball.net/mannschaften/${teamId}/spielplan`;

  try {
    const response = await axios.get(url);
    const $ = load(response.data);
    let gameIDs = [];
    $("a.contents").each((index, element) => {
      const href = $(element).attr("href");
      if (href) {
        const parts = href.split("/");
        const gameId = parts[parts.length - 2];
        if (gameId) {
          gameIDs.push(gameId);
        }
      }
    });
    res.status(200).json(gameIDs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fehler beim Abrufen der Spiel IDs", error });
  }
};

export const getAllGamesDetails = async (req, res) => {
  let { gameIds } = req.query;
  if (typeof gameIds === "string") {
    gameIds = gameIds.split(",");
  }
  const baseUrl = "https://www.handball.net/a/sportdata/1/games/";
  const endUrl = "/combined?";

  try {
    const response = await Promise.all(
      gameIds.map(async (gameId) => {
        const url = baseUrl + gameId + endUrl;
        const response = await axios.get(url);
        return response.data.data;
      })
    );
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fehler beim Abrufen der Spieldetails", error });
  }
};
