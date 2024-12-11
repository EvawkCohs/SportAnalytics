import React, { useEffect, useState, useRef } from "react";
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
import LineChart from "components/LineChartGameDetails";
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
  FormatSpecificEventDataCustomEvents,
  FormatSpecificGoalDataHome,
  FormatSpecificGoalDataAway,
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
  const [eventData, setEventData] = useState([]);

  // Daten formattieren für Charts
  const [teamGoalDataBar, setTeamGoalDataBar] = useState();
  const [teamGoalDataLine, setTeamGoalDataLine] = useState();
  const [suspensionData, setSuspensionData] = useState([]);
  const [redCardData, setRedCardData] = useState([]);
  const [sevenMeterData, setSevenMeterData] = useState([]);
  const [technicalFoulsData, setTechnicalFoulsData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mostValuable, setMostValuable] = useState();
  const [goalDataHomeTeam, setGoalDataHomeTeam] = useState();
  const [goalDataAwayTeam, setGoalDataAwayTeam] = useState([]);
  const [row, setRow] = useState();
  const hasFetchedData = useRef(false); // Ref für die Datenabfrage
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

    setGoalDataHomeTeam(FormatSpecificGoalDataHome(gameData));
    setGoalDataAwayTeam(FormatSpecificGoalDataAway(gameData));

    //MVP Statistik (Top3 Goalscorer)
    const sortedTableData = formattedTableData.sort(
      (a, b) => b.goals - a.goals
    );
    setMostValuable(sortedTableData.slice(0, 3));
    setRow(
      sortedTableData.map((row, index) => ({
        id: index,
        ...row,
      }))
    );
  }, [gameData]);
  useEffect(() => {
    if (
      !gameData ||
      !gameData.data ||
      !gameData.data.summary ||
      !gameData.data.events
    ) {
      return;
    }

    const key = `eventData.${gameData.data.summary.id}`;

    // Versuche, die Daten aus localStorage abzurufen
    const storedData = localStorage.getItem(key);

    if (storedData) {
      // Wenn Daten vorhanden sind, parse sie und setze sie in den State
      const parsedData = JSON.parse(storedData).events;
      setEventData(parsedData);
    }
  }, [gameData]); // Abhängigkeiten auf `gameData` beschränken

  useEffect(() => {
    if (!eventData || eventData.length === 0) return;

    if (!hasFetchedData.current) {
      setTechnicalFoulsData(
        FormatSpecificEventDataCustomEvents(
          eventData,
          "technicalFault",
          gameData.data.summary.homeTeam.name,
          gameData.data.summary.awayTeam.name
        )
      );
      hasFetchedData.current = true; // Markiere, dass die Daten abgerufen wurden
    }
  }, [eventData, gameData]); // Überprüfen von `eventData` und `gameData`
  //Tabellen Spalten und Reihen
  const cols = columnsDataGrid;
  const handleAnalyseButton = () => {
    navigate(`/videoanalyse/${id}`);
  };

  const handleCellClick = (param) => {
    let home = true;
    param.row.team === gameData.data.summary.homeTeam.name
      ? (home = true)
      : (home = false);

    const name = `${param.row.firstname} ${param.row.lastname}`;
    const events = eventData.length !== 0 ? eventData : gameData.data.events;

    navigate(`/details/${id}/${param.row.firstname}_${param.row.lastname}`, {
      state: {
        player: param.row,
        opponent:
          gameData.data.summary.homeTeam.name === param.row.team
            ? gameData.data.summary.awayTeam.name
            : gameData.data.summary.homeTeam.name,
        mvp:
          mostValuable[0].number === param.row.number &&
          mostValuable[0].team === param.row.team
            ? true
            : false,
        events: home
          ? events
              .filter((event) => event.team === "Home")
              .filter((event) => event.message.includes(name))
          : events
              .filter((event) => event.team === "Away")
              .filter((event) => event.message.includes(name)),
      },
    });
  };

  if (
    tableData.length === undefined ||
    gameData.isLoading ||
    !goalDataAwayTeam ||
    !goalDataHomeTeam
  ) {
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
              className="data-display"
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
            className="data-display"
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
          <Box gridColumn="7/9" gridRow="span 1">
            <SimpleStatBox
              value={gameData.data.summary.attendance}
              secondaryValue={gameData.data.summary.field.name}
              title="Zuschauer"
            />
          </Box>

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
          {/*Box 5th column */}
          <PieChart
            data={goalDataHomeTeam}
            title={`Tore nach Positionen ${gameData.data.summary.homeTeam.name}`}
          />
          {/*Box 6th column */}
          {
            <PieChart
              data={goalDataAwayTeam}
              title={`Tore nach Positionen ${gameData.data.summary.awayTeam.name}`}
            />
          }
          <Box
            gridColumn="span 8"
            gridRow="9 / 14"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            p="1.25rem 1rem"
            flex="1 1 100%"
            backgroundColor={theme.palette.background.alt}
            borderRadius="0.55rem"
            className="data-display"
            sx={{
              "& .MuiDataGrid-root": {
                borderBottom: "none",
              },
              "& .MuiDataGrid-cell": {
                color: theme.palette.secondary[200],
                fontSize: 14,
              },

              "& .MuiDataGrid-columnHeaders": {
                color: theme.palette.secondary[200],
                borderBottom: "none",
                fontSize: 20,
              },

              "& .MuiDataGrid-footerContainer": {
                backgroundColor: theme.palette.grey[850],
                color: theme.palette.secondary[400],
                borderTop: "none",
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${theme.palette.secondary[400]} !important`,
              },
              "& .MuiDataGrid-row": {
                "&:hover": {
                  backgroundColor: theme.palette.grey[700],
                  cursor: "pointer",
                },
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
              sx={{ color: theme.palette.secondary[200] }}
              textAlign="center"
              mb="20px"
            >
              Einzelstatistiken
            </Typography>
            <DataGrid
              rows={row || []}
              columns={cols}
              components={{ ColumnMenu: CustomColumnMenu }}
              localeText={{
                noRowsLabel: "Noch keine Daten verfügbar",
              }}
              onCellClick={handleCellClick}
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
}
export default Details;
