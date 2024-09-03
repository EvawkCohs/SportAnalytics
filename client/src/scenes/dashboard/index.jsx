import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Header from "components/Header";
import { useGetGamesWithDetailsQuery, useGetTeamModelQuery } from "state/api";
import useFetchGameIDs from "scenes/schedule/useFetchGameID";
import useFetchSchedule from "scenes/schedule/useFetchSchedule";
import StatBoxGameInfo from "components/StatBoxGameInfo";
import formatTimestamp from "conversionScripts/formatTimestamp";
import useGameDetails from "./useGetGameDetails";
import {
  NextFiveGames,
  LastFiveGames,
  GetDetailedGameData,
  GetTotalGoals,
  GetAverageGoals,
} from "./collectGamesAndDetails";

const Dashboard = () => {
  const teamId = useSelector((state) => state.global.teamId);
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { data: teamData, isLoading } = useGetTeamModelQuery();
  const gameIDs = useFetchGameIDs(teamId);
  const { schedule, loading, error } = useFetchSchedule(teamId);

  const dataWithIDs = schedule.map((item, index) => ({
    ...item,
    gameID: gameIDs[index] || "N/A",
  }));

  //Nächsten 5 Spiele
  const allGamesDetails = GetDetailedGameData(dataWithIDs);
  const updatedNextFiveGames = NextFiveGames(dataWithIDs);
  // letzten 5 Spiele
  const dataLastFiveGames = LastFiveGames(dataWithIDs);
  //Tore
  const [totalGoals, setTotalGoals] = useState(0);
  const [averageGoals, setAverageGoals] = useState(0);
  useEffect(() => {
    if (allGamesDetails === undefined) return;
    //Tore
    setTotalGoals(GetTotalGoals(allGamesDetails, teamId));
    //Torschnitt
    setAverageGoals(GetAverageGoals(allGamesDetails, totalGoals));
  }, [allGamesDetails, totalGoals]);

  console.log(averageGoals);

  if (
    isLoading ||
    updatedNextFiveGames === undefined ||
    updatedNextFiveGames < 5 ||
    dataLastFiveGames === undefined ||
    dataLastFiveGames < 1 ||
    loading
  ) {
    return <div>Loading....</div>; // Später noch Ladekreis einbauen oder etwas vergleichbares
  }
  if (error) {
    return <div>Fehler beim Laden der Daten</div>;
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
          gridColumn="1/5"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p="1.25rem 1rem"
          flex="1 1 100%"
          backgroundColor={theme.palette.background.alt}
          borderRadius="0.55rem"
          m="2rem 1.5rem "
        >
          {updatedNextFiveGames.length > 0 ? (
            <StatBoxGameInfo
              title={`Nächstes Spiel`}
              round={`${
                updatedNextFiveGames[0].summary.round.name
              } - ${formatTimestamp(updatedNextFiveGames[0].summary.startsAt)}`}
              finalScore={`${
                updatedNextFiveGames[0].summary.homeGoals ?? "0"
              } : ${updatedNextFiveGames[0].summary.awayGoals ?? "0"}`}
              halftimeScore={`(${
                updatedNextFiveGames[0].summary.homeGoalsHalf ?? "0"
              } : ${updatedNextFiveGames[0].summary.awayGoalsHalf ?? "0"})`}
              homeTeam={updatedNextFiveGames[0].summary.homeTeam.name}
              awayTeam={updatedNextFiveGames[0].summary.awayTeam.name}
            />
          ) : (
            <Box>
              <Typography
                variant="h2"
                sx={{ color: theme.palette.secondary[200] }}
                textAlign="center"
              >
                Nächstes Spiel
              </Typography>
              <Typography
                variant="h2"
                sx={{ color: theme.palette.secondary[100] }}
                textAlign="center"
                mt="50px"
              >
                laden...
              </Typography>
            </Box>
          )}
        </Box>
        {/*Letztes Spiel */}
        <Box
          gridColumn="5/8"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p="1.25rem 1rem"
          flex="1 1 100%"
          backgroundColor={theme.palette.background.alt}
          borderRadius="0.55rem"
          m="2rem 1.5rem "
        >
          {dataLastFiveGames.length > 0 ? (
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
