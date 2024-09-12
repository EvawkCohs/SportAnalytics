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

export const GetTotalGoals = (allGamesDetails, teamId) => {
  let totalGoals = 0;
  allGamesDetails.forEach((game) => {
    if (game.summary.homeTeam.id === teamId) {
      totalGoals += game.summary.homeGoals;
    } else {
      totalGoals += game.summary.awayGoals;
    }
  });
  return totalGoals;
};

export const GetAverageGoals = (allGamesDetails, totalGoals) => {
  const gamesPlayed = allGamesDetails.filter(
    (game) => game.summary.homeGoals > 0
  );

  const averageGoals = totalGoals / gamesPlayed.length;
  return averageGoals;
};

export const GetAverageGoalsLastFive = (dataLastFiveGames, teamId) => {
  const gamesPlayed = dataLastFiveGames.length;
  let totalGoals = 0;
  dataLastFiveGames.forEach((game) => {
    if (game.summary.homeTeam.id === teamId) {
      totalGoals += game.summary.homeGoals;
    } else {
      totalGoals += game.summary.awayGoals;
    }
  });
  const averageGoalsLastFive = totalGoals / gamesPlayed;
  return averageGoalsLastFive;
};

export const GetAverageAttendance = (allGamesDetails, teamId) => {
  const playedGames = allGamesDetails.filter(
    (game) =>
      game.summary.state === "Post" &&
      game.summary.attendance > 0 &&
      game.summary.homeTeam.id === teamId
  );
  let totalAttendance = 0;
  playedGames.map((game) => {
    totalAttendance += game.summary.attendance;
  });
  return totalAttendance / playedGames.length;
};

export const GetBestPeriodLastFive = (dataLastFiveGames, teamId) => {
  const gamesPlayed = dataLastFiveGames.length;
  const periodData = [
    {
      "0. - 10. Min": 0,
      "11. - 20. Min": 0,
      "21. - 30. Min": 0,
      "31. - 40. Min": 0,
      "41. - 50. Min": 0,
      "51. - 60. Min": 0,
    },
  ];

  dataLastFiveGames.map((game) => {
    for (const element of game.events) {
      if (element.type === "Goal" || element.type === "SevenMeterGoal") {
        if (game.summary.homeTeam.id === teamId) {
          const timeParts = element.time.split(":");
          const minutes = parseInt(timeParts[0], 10);
          const seconds = parseInt(timeParts[1], 10);

          if (minutes >= 0 && minutes < 10) {
            if (element.team === "Home") {
              periodData[0]["0. - 10. Min"] += 1;
            }
          } else if (minutes >= 10 && minutes < 20) {
            if (element.team === "Home") {
              periodData[0]["11. - 20. Min"] += 1;
            }
          } else if (
            minutes >= 20 &&
            (minutes < 30 || (minutes === 30 && seconds === 0))
          ) {
            if (element.team === "Home") {
              periodData[0]["21. - 30. Min"] += 1;
            }
          } else if (
            minutes >= 30 &&
            (minutes < 40 || (minutes === 40 && seconds === 0))
          ) {
            if (element.team === "Home") {
              periodData[0]["31. - 40. Min"] += 1;
            }
          } else if (
            minutes >= 40 &&
            (minutes < 50 || (minutes === 50 && seconds === 0))
          ) {
            if (element.team === "Home") {
              periodData[0]["41. - 50. Min"] += 1;
            }
          } else if (
            minutes >= 50 &&
            (minutes < 60 || (minutes === 60 && seconds === 0))
          ) {
            if (element.team === "Home") {
              periodData[0]["51. - 60. Min"] += 1;
            }
          }
        } else if (game.summary.awayTeam.id === teamId) {
          const timeParts = element.time.split(":");
          const minutes = parseInt(timeParts[0], 10);
          const seconds = parseInt(timeParts[1], 10);

          if (minutes >= 0 && minutes < 10) {
            if (element.team === "Away") {
              periodData[0]["0. - 10. Min"] += 1;
            }
          } else if (minutes >= 10 && minutes < 20) {
            if (element.team === "Away") {
              periodData[0]["11. - 20. Min"] += 1;
            }
          } else if (
            minutes >= 20 &&
            (minutes < 30 || (minutes === 30 && seconds === 0))
          ) {
            if (element.team === "Away") {
              periodData[0]["21. - 30. Min"] += 1;
            }
          } else if (
            minutes >= 30 &&
            (minutes < 40 || (minutes === 40 && seconds === 0))
          ) {
            if (element.team === "Away") {
              periodData[0]["31. - 40. Min"] += 1;
            }
          } else if (
            minutes >= 40 &&
            (minutes < 50 || (minutes === 50 && seconds === 0))
          ) {
            if (element.team === "Away") {
              periodData[0]["41. - 50. Min"] += 1;
            }
          } else if (
            minutes >= 50 &&
            (minutes < 60 || (minutes === 60 && seconds === 0))
          ) {
            if (element.team === "Away") {
              periodData[0]["51. - 60. Min"] += 1;
            }
          }
        }
      }
    }
  });
  //Teile die Gesamtanzahl der Tore durch die gespielten Spiele
  periodData.forEach((obj) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = obj[key] / gamesPlayed;
      }
    }
  });

  return periodData;
};
