import React from "react";
import Header from "components/Header";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { DownloadOutlined } from "@mui/icons-material";
import StatBox from "components/StatBox";
import { useParams } from "react-router-dom";
import formatTimestamp from "conversionScripts/formatTimestamp.js";
import useFetchGameDetails from "./useFetchGameDetails";
import TeamGoalChart from "components/TeamGoalChart";
import { gameExampleData } from "./gameExample";

function Details() {
  const theme = useTheme();
  //Daten der Spiele annehmen
  const { id } = useParams();
  const { gameData, loading, error } = useFetchGameDetails(id);
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const goalDiffData = [
    {
      id: "Deutschland",
      color: "hsl(260, 70%, 50%)",
      data: [
        {
          x: 0,
          y: 0,
        },
        {
          x: 5,
          y: 3,
        },
        {
          x: 10,
          y: 7,
        },
      ],
    },
    {
      id: "Spain",
      color: "hsl(269, 70%, 50%)",
      data: [
        {
          x: 0,
          y: 0,
        },
        {
          x: 5,
          y: 5,
        },
        {
          x: 10,
          y: 9,
        },
      ],
    },
  ];
  const teamGoalData = [
    {
      Mannschaft: "Gelnhausen",
      "0 - 10min": 5,
      "0 - 10minColor": "hsl(62, 70%, 50%)",
      "11 - 20min": 3,
      "11 - 20minColor": "hsl(281, 70%, 50%)",
      "21 - 30min": 5,
      "21 - 30minColor": "hsl(302, 70%, 50%)",
      "31 - 40min": 7,
      "31 - 40minColor": "hsl(355, 70%, 50%)",
      "41 - 50min": 4,
      "41 - 50minColor": "hsl(39, 70%, 50%)",
      "51 - 60min": 4,
      "51 - 60minColor": "hsl(204, 70%, 50%)",
    },
    {
      Mannschaft: "Leutershausen",
      "0 - 10min": 6,
      "0 - 10minColor": "hsl(62, 70%, 50%)",
      "11 - 20min": 6,
      "11 - 20minColor": "hsl(281, 70%, 50%)",
      "21 - 30min": 2,
      "21 - 30minColor": "hsl(302, 70%, 50%)",
      "31 - 40min": 5,
      "31 - 40minColor": "hsl(355, 70%, 50%)",
      "41 - 50min": 7,
      "41 - 50minColor": "hsl(39, 70%, 50%)",
      "51 - 60min": 3,
      "51 - 60minColor": "hsl(204, 70%, 50%)",
    },
  ];

  //Log für Entwicklung
  //console.log(gameData);
  if (loading) {
    return <div>Loading....</div>; // Später noch Ladekreis einbauen oder etwas vergleichbares
  }

  if (error) {
    return <div>Error: {error}</div>; // Fehlermeldung Rendern (später anpassen)
  }

  return (
    <Box m="1.5rem  2.5rem">
      <FlexBetween>
        <Header
          title="GAME DETAILS"
          subtitle={`${gameData.data.summary.homeTeam.name} vs ${gameData.data.summary.awayTeam.name}`}
        />
        {/*IN DEN SUBTITLE NOCH DAS SPIEL EINFÜGEN (WER GEGEN WEN)*/}
        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Gamestats
          </Button>
        </Box>
      </FlexBetween>

      {/* GRID ERSTELLUNG */}

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(8, 1fr)"
        gridTemplateRows="repeat(4, 200px)"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1*/}
        <StatBox
          title={`${gameData.data.summary.phase.name}`}
          round={`${gameData.data.summary.round.name} - ${formatTimestamp(
            gameData.data.summary.startsAt
          )}`}
          finalScore={`${gameData.data.summary.homeGoals ?? "0"} : ${
            gameData.data.summary.awayGoals ?? "0"
          }`}
          halftimeScore={`(${gameData.data.summary.homeGoalsHalf ?? "0"} : ${
            gameData.data.summary.awayGoalsHalf ?? "0"
          })`}
          homeTeam={gameData.data.summary.homeTeam.name}
          awayTeam={gameData.data.summary.awayTeam.name}
        />
        {/*Box 1st Column */}
        <Box
          gridColumn="span 3"
          gridRow="2 / 4"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p="1.25rem 1rem"
          flex="1 1 100%"
          backgroundColor={theme.palette.background.alt}
          borderRadius="0.55rem"
        >
          {/* paste Content */}
        </Box>
        {/*Box 2nd Column */}
        <Box
          gridColumn="span 3"
          gridRow="2 / 4"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p="1.25rem 1rem"
          flex="1 1 100%"
          backgroundColor={theme.palette.background.alt}
          borderRadius="0.55rem"
        >
          {/* paste Content */}
          <TeamGoalChart data={gameExampleData} />
        </Box>
      </Box>
    </Box>
  );
}
export default Details;
