import { useState, useEffect } from "react";

const useFetchSchedule = (teamId) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Zusammengesetzte TeamURl
  const url =
    "https://www.handball.net/_next/data/EjPec89zJyU9pmKVkT93R/teams/" +
    teamId +
    "/schedule.json?teamId=" +
    teamId;

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
        const data = await response.json();
        setSchedule(data.pageProps.schedule.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [teamId]);

  return { schedule, loading, error };
};

export default useFetchSchedule;
