import axios from "axios";
import { load } from "cheerio";

export async function getGameIdsForTeam(team) {
  const slug = team?.id;
  if (!slug) return [];

  const upstream = `https://www.handball.net/mannschaften/${slug}/spielplan`;
  const base = "http://localhost:5001";
  const url = `${base}/proxy?url=${encodeURIComponent(upstream)}`;

  const { data: html } = await axios.get(url, { timeout: 20000 });
  const $ = load(html);

  // breiterer Selektor, falls Klassen variieren:
  const ids = new Set();
  $('a[href*="/spiele/"]').each((_i, el) => {
    const href = $(el).attr("href") || "";

    const parts = href.split("/").filter(Boolean);
    const id = parts[parts.length - 2];

    ids.add(id);
  });

  return Array.from(ids);
}
