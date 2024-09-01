import useGameDetails from "./useGetGameDetails";
import { useState, useEffect } from "react";
import { useGetGamesWithDetailsQuery } from "state/api";

export const NextFiveGames = (dataWithIDs) => {
  const currentDate = new Date();
  const convertToDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };
  //Nächsten 5 Spiele
  const nextFiveGames = dataWithIDs
    .filter((game) => game.Datum && convertToDate(game.Datum) > currentDate)
    .sort((a, b) => convertToDate(a.Datum) - convertToDate(b.Datum))
    .slice(0, 5)
    .map((game) => game.gameID);

  //GameID Validierung
  const [validGameIdsNextFive, setValidGameIdsNextFive] = useState([]);
  useEffect(() => {
    const filteredIds = nextFiveGames.filter((id) => id !== "N/A");

    // Nur aktualisieren, wenn sich die gültigen IDs ändern
    if (JSON.stringify(validGameIdsNextFive) !== JSON.stringify(filteredIds)) {
      setValidGameIdsNextFive(filteredIds);
    }
  }, [nextFiveGames, validGameIdsNextFive]);

  //Scrape Daten der Spiele, die nicht in der DB stehen.
  const updatedNextFiveGames = useGameDetails(
    useGetGamesWithDetailsQuery(nextFiveGames).data
  );
  return updatedNextFiveGames;
};

export const LastFiveGames = (dataWithIDs) => {
  const currentDate = new Date();
  const convertToDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };
  //letzten 5 Spiele
  const lastFiveGames = dataWithIDs
    .filter((game) => game.Datum && convertToDate(game.Datum) < currentDate)
    .sort((a, b) => convertToDate(b.Datum) - convertToDate(a.Datum))
    .slice(0, 5)
    .map((game) => game.gameID);

  //GameID Validierung
  const [validGameIdsLastFive, setValidGameIdsLastFive] = useState([]);
  useEffect(() => {
    const filteredIds = lastFiveGames.filter((id) => id !== "N/A");

    // Nur aktualisieren, wenn sich die gültigen IDs ändern
    if (JSON.stringify(validGameIdsLastFive) !== JSON.stringify(filteredIds)) {
      setValidGameIdsLastFive(filteredIds);
    }
  }, [lastFiveGames, validGameIdsLastFive]);

  //Scrape Daten der Spiele, die nicht in der DB stehen.
  const updatedNextFiveGames = useGameDetails(
    useGetGamesWithDetailsQuery(lastFiveGames).data
  );
  return updatedNextFiveGames;
};

export const GetDetailedGameData = (dataWithIDs) => {
  const [validGameIds, setValidGameIds] = useState([]);
  const allGames = dataWithIDs
    .filter((game) => game.Datum)
    .map((game) => game.gameID);

  useEffect(() => {
    const filteredIds = allGames.filter((id) => id !== "N/A");
    if (JSON.stringify(validGameIds) !== JSON.stringify(filteredIds)) {
      setValidGameIds(filteredIds);
    }
  }, [allGames]);
  const updatedAllGames = useGameDetails(
    useGetGamesWithDetailsQuery(validGameIds).data
  );
  return updatedAllGames;
};
