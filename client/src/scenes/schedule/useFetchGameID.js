import axios from "axios";
import { load } from "cheerio";
import { useState, useEffect } from "react";

const useFetchGameIDs = (teamId) => {
  const [gameIDs, setGameIDs] = useState([]);
  const url = `https://www.handball.net/mannschaften/${teamId}/spielplan`;

  useEffect(() => {
    const fetchData = async () => {
      const proxyUrl = `${process.env.local.REACT_APP_BASE_URL}/proxy`;
      const targetUrl = encodeURIComponent(url);
      const fullUrl = `${proxyUrl}?url=${targetUrl}`;

      try {
        //HTML der Seite abrufen
        const response = await axios.get(fullUrl);

        //HTML parsen
        const $ = load(response.data);

        //IDS sammeln
        let gameIDs = [];

        //Alle entsprechenden divs durchsuchen
        $("div.space-y-6").each((index, element) => {
          const id = $(element).attr("id");
          if (id && id.startsWith("sportradar.dhbdata.")) {
            gameIDs.push(id);
          }
        });
        setGameIDs(gameIDs);
      } catch (error) {
        console.error(error);
        throw new Error("Error occured while fetching game IDs");
      }
    };
    fetchData();
  }, [url]);
  return gameIDs;
};
export default useFetchGameIDs;
