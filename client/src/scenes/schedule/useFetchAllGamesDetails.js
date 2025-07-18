import { useEffect, useState } from "react";

const useFetchAllGamesDetails = (gameIds) => {
  const [games, setGames] = useState([]);
  const baseUrl = "https://www.handball.net/a/sportdata/1/games/";
  const endUrl = "/combined?";

  useEffect(() => {
    const fetchAllGames = async () => {
      if (!Array.isArray(gameIds)) {
        return;
      }
      if (gameIds.length !== 30 && gameIds.length !== 22) {
        return;
      }
      const results = await Promise.all(
        gameIds.map(async (gameId) => {
          const combinedUrl = baseUrl + gameId + endUrl;
          const proxyUrl = `${process.env.REACT_APP_BASE_URL}/proxy`;
          const targetUrl = encodeURIComponent(combinedUrl);
          const fullUrl = `${proxyUrl}?url=${targetUrl}`;
          const response = await fetch(fullUrl);
          const details = await response.json();
          return details.data;
        })
      );
      setGames(results);
    };
    fetchAllGames();
  }, [gameIds]);

  return games;
};
export default useFetchAllGamesDetails;
