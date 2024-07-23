import { useState, useEffect, useContext } from "react";
import { DataContext } from "components/DataContext";
import Papa from "papaparse";

const useFetchSchedule = (teamId, teamUrlEnding) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setData } = useContext(DataContext);

  //Zusammengesetzte TeamURl
  const url = `https://www.handball.net/a/sportdata/1/teams/${teamId}/team-schedule.csv?_rsc=${teamUrlEnding}`;

  useEffect(() => {
    const fetchData = async () => {
      //Proxy verwenden
      const proxyUrl = "http://localhost:5002/proxy";
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

            // Data setzen für Detailseite/Globale Verwendung
            setData(fetchedSchedule);

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
  }, [url, setData]);

  return { schedule, loading, error };
};

export default useFetchSchedule;
