import { useState, useEffect } from "react";
import Papa from "papaparse";

const useFetchSchedule = (teamId, teamUrlEnding) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Zusammengesetzte TeamURl
  const url = `https://www.handball.net/a/sportdata/1/teams/${teamId}/team-schedule.csv?_rsc=${teamUrlEnding}`;

  useEffect(() => {
    const fetchData = async () => {
      //Proxy verwenden
      const proxyUrl = `${process.env.REACT_APP_BASE_URL}/proxy`;
      const targetUrl = encodeURIComponent(url);

      const fullUrl = `${proxyUrl}?url=${targetUrl}`;

      try {
        setLoading(true);
        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        const csvText = await response.text();

        // Parse CSV data
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            const fetchedSchedule = result.data;
            setSchedule(fetchedSchedule);
            setLoading(false);
          },
          error: (error) => {
            throw new Error(error.message);
          },
        });
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { schedule, loading, error };
};

export default useFetchSchedule;
