import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//Components
import Header from "components/Header";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { DownloadOutlined, LiveTvOutlined } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";
import StatBoxGameInfo from "components/StatBoxGameInfo";
import StatBoxMVP from "components/StatBoxMVP";
import SimpleStatBox from "components/SimpleStatBox";
import TeamGoalChart from "components/TeamGoalChart";
import LineChart from "components/LineChart";
import PieChart from "components/PieChart";
import SimpleButton from "components/SimpleButton";
//Scripts
import { useParams } from "react-router-dom";
import formatTimestamp from "conversionScripts/formatTimestamp.js";
//Data & Format

import {
  FormatGameDataBar,
  FormatGameDataLine,
  FormatSpecificEventData,
  FormatTableData,
} from "./formatGameData";
import { columnsDataGrid } from "./dataGridDefinitions";
import { handleDownload } from "./handleDownload";
import { useGetGameModelQuery } from "state/api";

//Daten Speicherung
function Details() {
  const theme = useTheme();
  const navigate = useNavigate();

  //Daten der Spiele annehmen
  const { id } = useParams();
  const gameData = useGetGameModelQuery(id);
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  // Daten formattieren für Charts
  const [teamGoalDataBar, setTeamGoalDataBar] = useState();
  const [teamGoalDataLine, setTeamGoalDataLine] = useState();
  const [suspensionData, setSuspensionData] = useState([]);
  const [redCardData, setRedCardData] = useState([]);
  const [sevenMeterData, setSevenMeterData] = useState([]);
  const [technicalFoulsData, setTechnicalFoulsData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mostValuable, setMostValuable] = useState();
  const [row, setRow] = useState();

  useEffect(() => {
    if (
      !gameData ||
      !gameData.data ||
      !gameData.data.summary ||
      !gameData.data.events
    )
      return;

    setTeamGoalDataBar(FormatGameDataBar(gameData));
    setTeamGoalDataLine(FormatGameDataLine(gameData));
    setSuspensionData(FormatSpecificEventData(gameData, "TwoMinutePenalty"));
    const formattedTableData = FormatTableData(gameData);
    setTableData(formattedTableData);
    setRedCardData(FormatSpecificEventData(gameData, "Disqualification"));
    setSevenMeterData(FormatSpecificEventData(gameData, "SevenMeterGoal"));
    setTechnicalFoulsData(
      FormatSpecificEventData(gameData, "Technischer Fehler")
    );
    //MVP Statistik (Top3 Goalscorer)
    const sortedTableData = formattedTableData.sort(
      (a, b) => b.goals - a.goals
    );
    setMostValuable(sortedTableData.slice(0, 3));
    setRow(
      sortedTableData.map((row, index) => ({
        id: index,
        ...row,
        flex: 1,
      }))
    );
  }, [gameData]);
  //Tabellen Spalten und Reihen
  const cols = columnsDataGrid;
  const handleAnalyseButton = () => {
    navigate(`/videoanalyse/${id}`);
  };

  if (tableData.length === undefined || gameData.isLoading) {
    return <div>Loading....</div>; // Später noch Ladekreis einbauen oder etwas vergleichbares
  }

  // if (error) {
  //   return <div>Error: {error}</div>; // Fehlermeldung Rendern (später anpassen)
  // }

  return (
    <div id="content">
      <Box m="1.5rem  2.5rem">
        <FlexBetween>
          <Header
            title="GAME DETAILS"
            subtitle={`${gameData.data.summary.homeTeam.name} vs ${gameData.data.summary.awayTeam.name}`}
          />
          <Box gap="1.5rem" display="flex" flexDirection="row">
            <SimpleButton
              sx={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.background.alt,
                fontSize: "14px",
                fontWeight: "bold",
              }}
              onClick={handleAnalyseButton}
              text="Videoanalyse"
              Icon={LiveTvOutlined}
            ></SimpleButton>
            <SimpleButton
              sx={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.background.alt,
                fontSize: "14px",
                fontWeight: "bold",
              }}
              onClick={handleDownload}
              text="Download Gamestats"
              Icon={DownloadOutlined}
            ></SimpleButton>
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
            "& > div": {
              gridColumn: isNonMediumScreens ? undefined : "span 12",
            },
          }}
        >
          {/* ROW 1*/}
          {tableData.length > 0 ? (
            <StatBoxMVP
              nameMVP={`${mostValuable[0].firstname} ${mostValuable[0].lastname}`}
              goalsMVP={mostValuable[0].goals}
              penaltyMVP={mostValuable[0].penaltyGoals}
              teamMVP={mostValuable[0].acronym}
              name2nd={`${mostValuable[1].firstname} ${mostValuable[1].lastname}`}
              goals2nd={mostValuable[1].goals}
              penalty2nd={mostValuable[1].penaltyGoals}
              team2nd={mostValuable[1].acronym}
              name3rd={`${mostValuable[2].firstname} ${mostValuable[2].lastname}`}
              goals3rd={mostValuable[2].goals}
              penalty3rd={mostValuable[2].penaltyGoals}
              team3rd={mostValuable[2].acronym}
            />
          ) : (
            <Box
              gridColumn="1/3"
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
                Wertvollste Spieler
              </Typography>
            </Box>
          )}
          <Box
            gridColumn="3/7"
            gridRow="span 1"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            p="1.25rem 1rem"
            flex="1 1 100%"
            backgroundColor={theme.palette.background.alt}
            borderRadius="0.55rem"
          >
            <StatBoxGameInfo
              title={`${gameData.data.summary.phase.name}`}
              round={`${gameData.data.summary.round.name} - ${formatTimestamp(
                gameData.data.summary.startsAt
              )}`}
              finalScore={`${gameData.data.summary.homeGoals ?? "0"} : ${
                gameData.data.summary.awayGoals ?? "0"
              }`}
              halftimeScore={`(${
                gameData.data.summary.homeGoalsHalf ?? "0"
              } : ${gameData.data.summary.awayGoalsHalf ?? "0"})`}
              homeTeam={gameData.data.summary.homeTeam.name}
              awayTeam={gameData.data.summary.awayTeam.name}
            />
          </Box>
          <SimpleStatBox
            value={gameData.data.summary.attendance}
            secondaryValue={gameData.data.summary.field.name}
            title="Zuschauer"
          />
          {/* ROW 2*/}
          {/*Box 1st Column */}

          <LineChart data={teamGoalDataLine} />

          {/*Box 2nd Column */}

          <TeamGoalChart data={teamGoalDataBar} />

          {/* ROW 3*/}
          {/*Box 1st Column */}

          <PieChart data={suspensionData} title={"Zeitstrafen"} />
          {/*Box 2nd Column */}
          <PieChart data={redCardData} title={"Rote Karten"} />
          {/*Box 3rd Column */}
          <PieChart data={technicalFoulsData} title={"Technische Fehler"} />
          {/*Box 4th Column */}
          <PieChart data={sevenMeterData} title={"Siebenmetertore"} />
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
                backgroundColor: theme.palette.background.alt,
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
              "& .MuiDataGrid-overlay": {
                // Styling for the 'No Rows' overlay
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[200], // Change the text color
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                fontWeight: "bold",
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
              localeText={{
                noRowsLabel: "Noch keine Daten verfügbar",
              }}
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
}
export default Details;
