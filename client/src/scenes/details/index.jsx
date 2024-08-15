import React from "react";
import Header from "components/Header";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { DownloadOutlined } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";
import StatBoxGameInfo from "components/StatBoxGameInfo";
import StatBoxMVP from "components/StatBoxMVP";
import StatBoxGameAttendance from "components/StatBoxGameAttendance";
import { useParams } from "react-router-dom";
import formatTimestamp from "conversionScripts/formatTimestamp.js";
import useFetchGameDetails from "./useFetchGameDetails";
import TeamGoalChart from "components/TeamGoalChart";
import { gameExampleData } from "./gameExample";
import LineChart from "components/LineChart";
import { FormatGameDataBar, FormatGameDataLine } from "./formatGameData";
import PieChart from "components/PieChart";

function Details() {
  const theme = useTheme();
  //Daten der Spiele annehmen
  const { id } = useParams();
  const { gameData, loading, error } = useFetchGameDetails(id);
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  // Daten formattieren für Charts
  const teamGoalDataBar = FormatGameDataBar(gameExampleData);
  const teamGoalDataLine = FormatGameDataLine(gameExampleData);
  //2min Statistiken
  const suspensionData = [
    {
      id: gameExampleData.data.summary.homeTeam.name,
      label: gameExampleData.data.summary.homeTeam.name,
      value: 0,
      color: "hsl(219, 70%, 50%)",
    },
    {
      id: gameExampleData.data.summary.awayTeam.name,
      label: gameExampleData.data.summary.awayTeam.name,
      value: 0,
      color: "hsl(282, 70%, 50%)",
    },
  ];
  for (const element of gameExampleData.data.events) {
    if (element.type === "TwoMinutePenalty" && element.team === "Home") {
      suspensionData[0].value += 1;
    } else if (element.type === "TwoMinutePenalty" && element.team === "Away") {
      suspensionData[1].value += 1;
    }
  }
  //Daten für Statistiken als Tabelle

  const tableDataHome = gameExampleData.data.lineup.home;
  tableDataHome.forEach((obj) => {
    Object.assign(obj, { team: gameExampleData.data.summary.homeTeam.name });
    Object.assign(obj, {
      acronym: gameExampleData.data.summary.homeTeam.acronym,
    });
  });
  const tableDataAway = gameExampleData.data.lineup.away;
  tableDataAway.forEach((obj) => {
    Object.assign(obj, { team: gameExampleData.data.summary.awayTeam.name });
    Object.assign(obj, {
      acronym: gameExampleData.data.summary.awayTeam.acronym,
    });
  });
  const tableData = tableDataHome.concat(tableDataAway);

  //MVP Statistik (Top3 Goalscorer)
  const mostValuable = tableData.sort((a, b) => b.goals - a.goals).slice(0, 3);

  //Tabellen Spalten und Reihen
  const cols = [
    {
      field: "firstname",
      headerName: "Vorname",
      flex: 1,
    },
    {
      field: "lastname",
      headerName: "Nachname",
      flex: 1,
    },
    {
      field: "position",
      headerName: "Position",
      flex: 1,
    },
    {
      field: "number",
      headerName: "Trikotnummer",
      flex: 1,
    },
    {
      field: "goals",
      headerName: "Tore",
      flex: 1,
    },
    {
      field: "penaltyGoals",
      headerName: "7m Tore",
      flex: 1,
    },
    {
      field: "penaltyMissed",
      headerName: "7m Fehlwürfe",
      flex: 1,
    },
    {
      field: "penalties",
      headerName: "2min Strafen",
      flex: 1,
    },
    {
      field: "redCards",
      headerName: "Rote Karte",
      flex: 1,
    },
    {
      field: "team",
      headerName: "Mannschaft",
      flex: 1,
    },
  ];
  const row = tableData.map((row, index) => ({
    id: index,
    ...row,
    flex: 1,
  }));

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
        gridTemplateRows="repeat(12, 200px)"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1*/}
        <StatBoxMVP
          nameMVP={`${mostValuable[0].firstname} ${mostValuable[0].lastname}`}
          goalsMVP={mostValuable[0].goals}
          penaltyMVP={mostValuable[0].penalties}
          teamMVP={mostValuable[0].acronym}
          name2nd={`${mostValuable[1].firstname} ${mostValuable[1].lastname}`}
          goals2nd={mostValuable[1].goals}
          penalty2nd={mostValuable[1].penalties}
          team2nd={mostValuable[1].acronym}
          name3rd={`${mostValuable[2].firstname} ${mostValuable[2].lastname}`}
          goals3rd={mostValuable[2].goals}
          penalty3rd={mostValuable[2].penalties}
          team3rd={mostValuable[2].acronym}
        />

        <StatBoxGameInfo
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

        <StatBoxGameAttendance
          attendance={gameExampleData.data.summary.attendance}
          fieldName={gameExampleData.data.summary.field.name}
        />
        {/* ROW 2*/}
        {/*Box 1st Column */}

        <LineChart data={teamGoalDataLine} />

        {/*Box 2nd Column */}

        <TeamGoalChart data={teamGoalDataBar} />

        {/* ROW 3*/}
        {/*Box 1st Column */}
        <PieChart data={suspensionData} />
        {/*Box 2nd Column */}
        <Box
          gridColumn="span 8"
          gridRow="7 / 12"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p="1.25rem 1rem"
          flex="1 1 100%"
          backgroundColor={theme.palette.background.alt}
          borderRadius="0.55rem"
          sx={{
            "& .MuiDataGrid-root": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              backgroundColor: theme.palette.primary[500],
              cursor: "pointer",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.primary.light,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[400],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[400]} !important`,
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{ color: theme.palette.secondary[100] }}
            textAlign="center"
            mb="20px"
          >
            {" "}
            Einzelstatistiken
          </Typography>
          <DataGrid
            rows={row || []}
            columns={cols}
            components={{ ColumnMenu: CustomColumnMenu }}
          />
        </Box>
      </Box>
    </Box>
  );
}
export default Details;
