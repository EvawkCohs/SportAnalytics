import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import { useSelector } from "react-redux";
import React from "react";
import { useLocation } from "react-router-dom";
import { Box, useMediaQuery, Typography } from "@mui/material";
import {
  GetPlayerGoalsDataLine,
  GetPlayerStatisticsPerGame,
} from "./formatData";
import LineChart from "components/LineChartPlayerDetails";
import { useTheme } from "@emotion/react";
import SimpleStatBox from "components/SimpleStatBox";

const PlayerDetails = () => {
  const location = useLocation();
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const overallPlayerStatistics = location.state?.player;
  const teamId = useSelector((state) => state.global.teamId);
  const playerId = location.state?.player.id;
  const allGamesDetails = location.state?.allGamesDetails;
  const playerStatisticsPerGame = GetPlayerStatisticsPerGame(
    allGamesDetails,
    playerId,
    teamId
  );
  const playerGoalDataLine = GetPlayerGoalsDataLine(playerStatisticsPerGame);
  console.log(overallPlayerStatistics);
  if (playerGoalDataLine === undefined) {
    return <div>Loading....</div>;
  }
  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header
          subtitle={`${overallPlayerStatistics.team} | ${overallPlayerStatistics.position} | #${overallPlayerStatistics.number}`}
          title={`${overallPlayerStatistics.firstname} ${overallPlayerStatistics.lastname}`}
        />
      </FlexBetween>
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(8, 1fr)"
        gridTemplateRows="repeat(12, 150px)"
        gap="20px"
        sx={{
          "& > div": {
            gridColumn: isNonMediumScreens ? undefined : "span 12",
          },
        }}
      >
        {/*ROW 1 - 5 */}
        {/*Tore pro Spiel Chart ROW 1-5*/}

        <LineChart data={playerGoalDataLine} />

        {/*GamesPlayed ROW 1*/}
        <Box gridColumn="7/9" gridRow="span 1" display="flex">
          <SimpleStatBox
            title={"Spiele gespielt"}
            value={playerGoalDataLine[0].data.length}
          />
        </Box>
        {/* Gesamt Tore ROW 2 */}
        <Box gridColumn="7/9" gridRow="span 1" display="flex">
          <SimpleStatBox
            title={"Tore gesamt"}
            value={overallPlayerStatistics.goals}
          />
        </Box>
        {/* Durchschnitt Tore ROW 3 */}
        <Box gridColumn="7/9" gridRow="span 1" display="flex">
          <SimpleStatBox
            title={"Tore Ø"}
            value={
              overallPlayerStatistics.goals / playerGoalDataLine[0].data.length
            }
          />
        </Box>
        {/* Siebenmeter Tore / Versuche ROW 4 */}
        <Box
          gridColumn="7/9"
          gridRow="span 1"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p="1.25rem 1rem"
          flex="1 1 100%"
          backgroundColor={theme.palette.background.alt}
          borderRadius="0.55rem"
        >
          <Typography
            variant="h2"
            sx={{ color: theme.palette.secondary[200] }}
            textAlign="center"
          >
            Siebenmeter
          </Typography>
          <Typography
            variant="h2"
            sx={{ color: theme.palette.secondary[200] }}
            textAlign="center"
          >
            {overallPlayerStatistics.penaltyGoals} /{" "}
            {overallPlayerStatistics.penaltyGoals +
              overallPlayerStatistics.penaltyMissed}
          </Typography>
          <Box display="flex" flexDirection="row" justifyContent="center">
            <Typography
              variant="h3"
              sx={{ color: theme.palette.secondary[200] }}
              textAlign="center"
              mr="2rem"
            >
              Quote:
            </Typography>
            <Typography
              variant="h3"
              sx={{ color: theme.palette.secondary[200] }}
              textAlign="center"
            >
              {(overallPlayerStatistics.penaltyGoals /
                (overallPlayerStatistics.penaltyGoals +
                  overallPlayerStatistics.penaltyMissed)) *
                100}{" "}
              %
            </Typography>
          </Box>
        </Box>
        {/* Gelbekarten ROW 5 COL 1/2 */}
        <Box gridColumn="1/3" gridRow="5" display="flex">
          <SimpleStatBox
            title={"Gelbe Karten"}
            value={overallPlayerStatistics.yellowCards}
          />
        </Box>
        {/* Zeitstrafen ROW 5 COL 3/4 */}
        <Box gridColumn="3/5" gridRow="5" display="flex">
          <SimpleStatBox
            title={"Zeitstrafen"}
            value={overallPlayerStatistics.penalties}
          />
        </Box>
        {/* Rote Karten ROW 5 COL 5/6 */}
        <Box gridColumn="5/7" gridRow="5" display="flex">
          <SimpleStatBox
            title={"Rote Karten"}
            value={overallPlayerStatistics.redCards}
          />
        </Box>
      </Box>
    </Box>
  );
};
export default PlayerDetails;
