import TeamModel from "../models/TeamModel.js";
import { syncTeamGames } from "../services/syncTeamGames.js";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const isStale = (d) => !d || Date.now() - new Date(d).getTime() >= ONE_DAY_MS;

export function triggerSyncIfStale() {
  return async (req, _res, next) => {
    try {
      const teamMongoId =
        req.params.teamId || req.query.teamId || req.body.teamId;
      if (!teamMongoId) return next();

      const team = await TeamModel.findById(teamMongoId).select(
        "lastGamesSyncAt"
      );
      if (team && isStale(team.lastGamesSyncAt)) {
        // nicht awaiten → Antwort bleibt schnell
        void syncTeamGames(teamMongoId).catch((e) =>
          console.error("[triggerSyncIfStale]", e.message)
        );
      }
    } catch (e) {
      console.error("[triggerSyncIfStale] lookup failed", e.message);
    }
    next();
  };
}
