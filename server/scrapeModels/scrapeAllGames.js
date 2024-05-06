import dotenv from "dotenv";

dotenv.config();

export var overalldata;
async function scrapeAllGames() {
  await fetch(process.env.ALL_GAMES_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network error");
      }
      return response.json();
    })
    .then((data) => {
      overalldata = data.pageProps.schedule.data;
    })
    .catch((error) => {
      console.error("Error", error);
    });
}

export default scrapeAllGames;
