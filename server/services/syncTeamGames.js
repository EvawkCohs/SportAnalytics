import TeamModel from "../models/TeamModel.js";
import GameModel from "../models/gameModel.js";
import axios from "axios";
import { getGameIdsForTeam } from "./getGameIdsForTeam.js";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const isStale = (d) => !d || Date.now() - new Date(d).getTime() >= ONE_DAY_MS;

const GAME_DETAIL_BASE = "https://www.handball.net/a/sportdata/1/games/";
const GAME_DETAIL_END = "/combined?";

async function fetchGameDetailsForIds(gameIds) {
  const responses = await Promise.all(
    gameIds.map(async (gameId) => {
      const url = `${GAME_DETAIL_BASE}${gameId}${GAME_DETAIL_END}`;
      const { data } = await axios.get(url, { timeout: 20000 });
      return data?.data;
    })
  );
  return responses.filter(Boolean);
}

export async function syncTeamGames(teamMongoId, { force = false } = {}) {
  const team = await TeamModel.findById(teamMongoId);
  if (!team) throw new Error("Team not found");

  if (!force && !isStale(team.lastGamesSyncAt)) {
    return { skipped: true, reason: "fresh" };
  }

  const gameIds = await getGameIdsForTeam(team);
  if (!Array.isArray(gameIds) || gameIds.length === 0) {
    return { skipped: true, reason: "no-gameIds" };
  }
  const games = await fetchGameDetailsForIds(gameIDs);

  const bulkOperations = games.map((game) => ({
    updateOne: {
      filter: { "summary.id": game.summary.id },
      update: { $set: game },
      upsert: true,
    },
  }));

  if (bulkOperations.length) {
    await GameModel.bulkWrite(bulkOperations, { ordered: false });
  }

  team.lastGamesSyncAt = new Date();
  await team.save();

  return {
    skipped: false,
    upserts: bulkOperations.length,
    countIds: gameIds.length,
  };
}
