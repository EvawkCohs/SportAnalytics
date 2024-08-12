import React from "react";
import Header from "components/Header";
import { Box, useTheme, Button, useMediaQuery } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { DownloadOutlined } from "@mui/icons-material";
import StatBox from "components/StatBox";
import { useParams } from "react-router-dom";
import formatTimestamp from "conversionScripts/formatTimestamp.js";
import useFetchGameDetails from "./useFetchGameDetails";

function Details() {
  //Daten der Spiele annehmen
  const { id } = useParams();
  const { gameData, loading, error } = useFetchGameDetails(id);
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  //Log für Entwicklung
  console.log(gameData);
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
        gridAutoRows="225px"
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
      </Box>
    </Box>
  );
}
export default Details;
