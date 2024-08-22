import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Header from "components/Header";
import { useGetGamesWithDetailsQuery, useGetTeamModelQuery } from "state/api";
import useFetchGameIDs from "scenes/schedule/useFetchGameID";
import useFetchSchedule from "scenes/schedule/useFetchSchedule";
import useFetchGameDetails from "scenes/details/useFetchGameDetails";
import StatBoxGameInfo from "components/StatBoxGameInfo";
import formatTimestamp from "conversionScripts/formatTimestamp";
const Dashboard = () => {
  const teamId = useSelector((state) => state.global.teamId);
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { data: teamData, isLoading } = useGetTeamModelQuery();
  const gameIDs = useFetchGameIDs(teamId);
  const { schedule, loading, error } = useFetchSchedule(teamId);

  //Daten mit GameIDs versehen
  const dataWithIDs = schedule.map((item, index) => ({
    ...item,
    gameID: gameIDs[index] || "N/A",
  }));

  //Daten filtern
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

  const [validGameIdsNextFive, setValidGameIdsNextFive] = useState([]);
  useEffect(() => {
    const filteredIds = nextFiveGames.filter((id) => id !== "N/A");

    // Nur aktualisieren, wenn sich die gültigen IDs ändern
    if (JSON.stringify(validGameIdsNextFive) !== JSON.stringify(filteredIds)) {
      setValidGameIdsNextFive(filteredIds);
    }
  }, [nextFiveGames, validGameIdsNextFive]);

  const { data: dataNextFiveGames } =
    useGetGamesWithDetailsQuery(validGameIdsNextFive);

  //Letzten 5 Spiele
  const lastFiveGames = dataWithIDs
    .filter((game) => game.Datum && convertToDate(game.Datum) < currentDate)
    .sort((a, b) => convertToDate(a.Datum) - convertToDate(b.Datum))
    .slice(0, 5)
    .map((game) => game.gameID);
  const [validGameIdsLastFive, setValidGameIdsLastFive] = useState([]);
  useEffect(() => {
    const filteredIds = lastFiveGames.filter((id) => id !== "N/A");

    // Nur aktualisieren, wenn sich die gültigen IDs ändern
    if (JSON.stringify(validGameIdsLastFive) !== JSON.stringify(filteredIds)) {
      setValidGameIdsLastFive(filteredIds);
    }
  }, [lastFiveGames, validGameIdsLastFive]);
  const { data: dataLastFiveGames } =
    useGetGamesWithDetailsQuery(validGameIdsLastFive);
  console.log(dataLastFiveGames);
  if (
    isLoading ||
    dataNextFiveGames === undefined ||
    dataNextFiveGames.length < 5 ||
    dataLastFiveGames === undefined
  ) {
    return <div>Loading....</div>; // Später noch Ladekreis einbauen oder etwas vergleichbares
  }
  return (
    <Box m="1.5rem 2.5rem">
      <Box
        display="grid"
        gridTemplateColumns="repeat(8, 1fr)"
        gridTemplateRows="3"
        sx={{
          "& > div": {
            gridColumn: isNonMediumScreens ? undefined : "span 12",
          },
        }}
      >
        <Header
          title={(teamData || []).find((team) => team.id === teamId).name}
          subtitle={"Überblick"}
          gridColumn="span 6"
        />
        {/*Nächstes Spiel */}
        <Box
          gridColumn="1/3"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p="1.25rem 1rem"
          flex="1 1 100%"
          backgroundColor={theme.palette.background.alt}
          borderRadius="0.55rem"
          m="2rem 1.5rem "
        >
          <StatBoxGameInfo
            title={`Nächstes Spiel`}
            round={`${
              dataNextFiveGames[0].summary.round.name
            } - ${formatTimestamp(dataNextFiveGames[0].summary.startsAt)}`}
            finalScore={`${dataNextFiveGames[0].summary.homeGoals ?? "0"} : ${
              dataNextFiveGames[0].summary.awayGoals ?? "0"
            }`}
            halftimeScore={`(${
              dataNextFiveGames[0].summary.homeGoalsHalf ?? "0"
            } : ${dataNextFiveGames[0].summary.awayGoalsHalf ?? "0"})`}
            homeTeam={dataNextFiveGames[0].summary.homeTeam.name}
            awayTeam={dataNextFiveGames[0].summary.awayTeam.name}
          />
        </Box>
        {/*Letztes Spiel */}
        <Box
          gridColumn="3/5"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p="1.25rem 1rem"
          flex="1 1 100%"
          backgroundColor={theme.palette.background.alt}
          borderRadius="0.55rem"
          m="2rem 1.5rem "
        >
          {dataLastFiveGames.lenght > 0 ? (
            <StatBoxGameInfo
              title={`Letztes Spiel`}
              round={`${
                dataLastFiveGames[0].summary.round.name
              } - ${formatTimestamp(dataLastFiveGames[0].summary.startsAt)}`}
              finalScore={`${dataLastFiveGames[0].summary.homeGoals ?? "0"} : ${
                dataLastFiveGames[0].summary.awayGoals ?? "0"
              }`}
              halftimeScore={`(${
                dataLastFiveGames[0].summary.homeGoalsHalf ?? "0"
              } : ${dataLastFiveGames[0].summary.awayGoalsHalf ?? "0"})`}
              homeTeam={dataLastFiveGames[0].summary.homeTeam.name}
              awayTeam={dataLastFiveGames[0].summary.awayTeam.name}
            />
          ) : (
            <Box>
              <Typography
                variant="h2"
                sx={{ color: theme.palette.secondary[200] }}
                textAlign="center"
              >
                Letztes Spiel
              </Typography>
              <Typography
                variant="h2"
                sx={{ color: theme.palette.secondary[100] }}
                textAlign="center"
                mt="50px"
              >
                Noch keine Spiele gespielt!
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
