import { useEffect, useState } from "react";

const useFetchAllGamesDetails = (gameIds) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!Array.isArray(gameIds) || gameIds.length === 0) return;

    const fetchAllGames = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${
          process.env.REACT_APP_BASE_URL
        }/client/allgamesdetails?gameIds=${gameIds.join(",")}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fehler beim Laden der Spieldetails");
        const details = await response.json();
        setGames(details);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllGames();
  }, [gameIds]);

  return { games, loading, error };
};

export default useFetchAllGamesDetails;
