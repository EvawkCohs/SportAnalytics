import React, { useContext } from "react";
import Header from "components/Header";
import { Box, useTheme, Button, useMediaQuery } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { DownloadOutlined } from "@mui/icons-material";
import StatBox from "components/StatBox";
import { DataContext } from "components/DataContext";
import { useParams } from "react-router-dom";
import formatTimestamp from "conversionScripts/formatTimestamp.js";
import useFetchGameDetails from "./useFetchGameDetails";

function Details() {
  //Daten der Spiele annehmen
  const { id } = useParams();
  const { data } = useContext(DataContext);
  const row = data.find((item) => item.id === id); // TODO: Stattdessen fetch auf Gamedaten mittels id aus "useParams" -> Detaildaten lassen sich nicht über Schedule einlesen! DataContext somit nicht zwingend notwendig
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  //Log für Entwicklung
  console.log(id);
  return (
    <Box m="1.5rem  2.5rem">
      <FlexBetween>
        <Header title="GAME DETAILS" subtitle="Details of selected game" />{" "}
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
          title={`${row.phase.name}`}
          round={`${row.round.name} - ${formatTimestamp(row.startsAt)}`}
          finalScore={`${row.homeGoals} : ${row.awayGoals}`}
          halftimeScore={`(${row.homeGoalsHalf} : ${row.awayGoalsHalf})`}
          homeTeam={row.homeTeam.name}
          awayTeam={row.awayTeam.name}
        />
      </Box>
    </Box>
  );
}
export default Details;
