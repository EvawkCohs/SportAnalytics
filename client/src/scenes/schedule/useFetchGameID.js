import axios from "axios";
import { load } from "cheerio";
import { useState, useEffect } from "react";

const useFetchGameIDs = (teamId) => {
  const [gameIDs, setGameIDs] = useState([]);
  const [error, setError] = useState(null);
  const url = `https://www.handball.net/mannschaften/${teamId}/spielplan`;

  useEffect(() => {
    const fetchData = async () => {
      const proxyUrl = `${process.env.REACT_APP_BASE_URL}/proxy`;
      const targetUrl = encodeURIComponent(url);
      const fullUrl = `${proxyUrl}?url=${targetUrl}`;

      try {
        // HTML der Seite abrufen
        const response = await axios.get(fullUrl);

        // HTML parsen
        const $ = load(response.data);

        // IDS sammeln
        let gameIDs = [];

        // Alle <a class="contents"> durchsuchen
        $("a.contents").each((index, element) => {
          const href = $(element).attr("href");
          if (href) {
            const parts = href.split("/");
            const gameId = parts[parts.length - 1];
            if (gameId) {
              gameIDs.push(gameId);
            }
          }
        });
        setGameIDs(gameIDs);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, [url]);
  return { gameIDs, error };
};
export default useFetchGameIDs;
