import { useEffect, useState } from "react";

const useGameDetails = (games) => {
  const [updatedGames, setUpdatedGames] = useState(games);
  const baseUrl = "https://www.handball.net/a/sportdata/1/games/";
  const endUrl = "/combined?";

  useEffect(() => {
    const fetchMissingGames = async () => {
      if (!Array.isArray(games)) {
        return;
      }
      const results = await Promise.all(
        games.map(async (game) => {
          if (game.id === "N/A" || game.exists !== false) {
            return game;
          }

          const combinedUrl = baseUrl + game.id + endUrl;
          const proxyUrl = "http://localhost:5002/proxy";
          const targetUrl = encodeURIComponent(combinedUrl);
          const fullUrl = `${proxyUrl}?url=${targetUrl}`;
          const response = await fetch(fullUrl);
          const details = await response.json();

          return details.data;
        })
      );

      setUpdatedGames(results);
    };
    fetchMissingGames();
  }, [games]);

  return updatedGames;
};
export default useGameDetails;
