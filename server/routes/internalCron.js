import express from "express";
import TeamModel from "../models/TeamModel.js";
import { syncTeamGames } from "../services/syncTeamGames.js";

const router = express.Router();
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function auth(req, res) {
  if (req.headers["x-cron-token"] !== process.env.CRON_TOKEN) {
    res.status(401).json({ error: "unauthorized" });
    return false;
  }
  return true;
}

// Alle Teams, deren Sync >24h alt ist
router.post("/cron/sync-overdue-teams", async (req, res) => {
  if (!auth(req, res)) return;
  try {
    const since = new Date(Date.now() - ONE_DAY_MS);
    const overdue = await TeamModel.find({
      $or: [
        { lastGamesSyncAt: { $exists: false } },
        { lastGamesSyncAt: null },
        { lastGamesSyncAt: { $lt: since } },
      ],
    }).select("_id name id season");

    const results = [];
    for (const t of overdue) {
      try {
        const r = await syncTeamGames(t._id);
        results.push({ teamId: String(t._id), ok: true, ...r });
        // kleine Pause für Rate Limits
        await new Promise((r) => setTimeout(r, 250));
      } catch (e) {
        results.push({ teamId: String(t._id), ok: false, error: e.message });
      }
    }
    res.json({ ok: true, count: overdue.length, results });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post("/cron/sync-team/:teamMongoId", async (req, res) => {
  if (!auth(req, res)) return;
  try {
    const r = await syncTeamGames(req.params.teamMongoId, { force: true });
    res.json({ ok: true, ...r });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

export default router;
