// TODO: Fetch auf Detaildaten des einzelnen Spiels
import { useState, useEffect } from "react";

const useFetchGameDetails = (gameId) => {
  const [gameData, setGameData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = "https://www.handball.net/a/sportdata/1/games/";
  const endUrl = "/combined?";
  const combinedUrl = baseUrl + gameId + endUrl;

  useEffect(() => {
    const fetchData = async () => {
      //Proxy verwenden
      const proxyUrl = "http://localhost:5002/proxy";
      const targetUrl = encodeURIComponent(combinedUrl);
      const fullUrl = `${proxyUrl}?url=${targetUrl}`;

      try {
        setLoading(true);
        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        const data = await response.json();
        setGameData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [gameId, combinedUrl]);
  return { gameData, loading, error };
};
export default useFetchGameDetails;
