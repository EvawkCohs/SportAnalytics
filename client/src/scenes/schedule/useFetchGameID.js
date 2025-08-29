import axios from "axios";
import { useState, useEffect } from "react";

const useFetchGameIDs = (teamId) => {
  const [gameIDs, setGameIDs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const url = `${process.env.REACT_APP_BASE_URL}/client/gameids?teamId=${teamId}`;
      try {
        const response = await axios.get(url);
        setGameIDs(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [teamId]);
  return { gameIDs, loading, error };
};
export default useFetchGameIDs;
