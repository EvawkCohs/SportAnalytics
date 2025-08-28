import axios from "axios";
import { useState, useEffect } from "react";

const useFetchGameIDs = (teamId) => {
  const [gameIDs, setGameIDs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const url = `${process.env.REACT_APP_BASE_URL}/client/gameids?teamId=${teamId}`;
      try {
        const response = await axios.get(url);
        setGameIDs(response.data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, [teamId]);
  return { gameIDs, error };
};
export default useFetchGameIDs;
