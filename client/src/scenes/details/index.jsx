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
  FormatSpecificGoalDataHome,
  FormatSpecificGoalDataAway,
  FormatTurnoverData,
  FormatMissedShotsData,
} from "./formatGameData";
import { columnsDataGrid, columnsDataGridSmall } from "./dataGridDefinitions";
import { handleDownload } from "./handleDownload";
import {
  useGetGameModelQuery,
  useGetUserProfileQuery,
  useGetUserGamesQuery,
} from "state/api";
import { skipToken } from "@reduxjs/toolkit/query";
import { LoadingCircle } from "components/LoadingCircle";
import { ErrorMessageServer } from "components/ErrorMessageServer";

//Daten Speicherung
function Details() {
  const theme = useTheme();
  const navigate = useNavigate();

  //Daten der Spiele annehmen
  const { id } = useParams();
  const data = useGetGameModelQuery(id);

  const gameData = data.data;
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [eventData, setEventData] = useState([]);

  // Daten formattieren für Charts
  const [teamGoalDataBar, setTeamGoalDataBar] = useState();
  const [teamGoalDataLine, setTeamGoalDataLine] = useState();
  const [suspensionData, setSuspensionData] = useState([]);
  const [redCardData, setRedCardData] = useState([]);
  const [sevenMeterData, setSevenMeterData] = useState([]);
  const [technicalFoulsData, setTechnicalFoulsData] = useState([]);
  const [turnoverData, setTurnoverData] = useState([]);
  const [offensiveFoulData, setOffensiveFoulData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mostValuable, setMostValuable] = useState();
  const [goalDataHomeTeam, setGoalDataHomeTeam] = useState();
  const [goalDataAwayTeam, setGoalDataAwayTeam] = useState([]);
  const [row, setRow] = useState();
  const [missedShotsData, setMissedShotsData] = useState([]);
  const [fastbreakData, setFastbreakData] = useState([]);

  //Profil
  const { data: profile } = useGetUserProfileQuery();

  //Daten aus Nutzerdefinierten Stats
  const [userGameData, setUserGameData] = useState({
    userId: "",
    summary: {},
    lineup: {},
    events: [],
  });
  const shouldFetch = profile?.username && id;
  const { data: specificGameData, error } = useGetUserGamesQuery(
    shouldFetch ? { gameId: id, userId: profile.username } : skipToken
  );
  useEffect(() => {
    if (!gameData) return;
    setUserGameData((prevData) => ({
      ...prevData,
      summary: gameData.summary,
      lineup: gameData.lineup,
      events: gameData.events,
    }));
    if (!shouldFetch) return;
    if (specificGameData && Object.keys(specificGameData.length > 0)) {
      setUserGameData((prevData) => ({
        ...prevData,
        userId: profile.username,
        summary: specificGameData.summary,
        lineup: specificGameData.lineup,
        events: specificGameData.events,
      }));
      setEventData(specificGameData.events);
    } else if (error) {
      console.error(
        "Kein benutzerdefiniertes Spiel gefunde, verwende Handball.net",
        error
      );
    }
  }, [profile, gameData, id, specificGameData, error, shouldFetch]);

  //DATENBERECHNUNG USE-EFFECT
  useEffect(() => {
    if (
      !gameData ||
      !gameData?.lineup ||
      !gameData?.summary ||
      !gameData?.events
    )
      return;

    const dataSource = userGameData;
    if (!dataSource) return;
    //Tore pro Sequenz und Differenzverlauf

    setTeamGoalDataBar(FormatGameDataBar({ data: dataSource }));
    setTeamGoalDataLine(
      FormatGameDataLine({
        data: dataSource,
      })
    );
    //2-min Daten
    setSuspensionData(
      FormatSpecificEventData({ data: dataSource }, "TwoMinutePenalty")
    );
    //Einzelstatistiken
    const formattedTableData = FormatTableData({ data: dataSource });
    setTableData(formattedTableData);
    //Rote Karten Daten
    setRedCardData(
      FormatSpecificEventData({ data: dataSource }, "Disqualification")
    );
    //7-m Daten
    setSevenMeterData(
      FormatSpecificEventData({ data: dataSource }, "SevenMeterGoal")
    );

    //Tor Daten Heimteam/Auswärtsteam
    setGoalDataHomeTeam(FormatSpecificGoalDataHome({ data: dataSource }));
    setGoalDataAwayTeam(FormatSpecificGoalDataAway({ data: dataSource }));

    //CUSTOM DATA
    //Technische Fehler Daten
    setTechnicalFoulsData(
      FormatSpecificEventData({ data: dataSource }, "technicalFault")
    );
    //Turnover Daten
    setTurnoverData(FormatTurnoverData({ data: dataSource }));
    //Stürmerfoul Daten
    setOffensiveFoulData(
      FormatSpecificEventData({ data: dataSource }, "offensiveFoul")
    );
    //Fehlwurf Daten
    setMissedShotsData(FormatMissedShotsData({ data: dataSource }));
    //Gegenstoß Daten
    setFastbreakData(
      FormatSpecificEventData({ data: dataSource }, "fastbreak")
    );
    //MVP Statistik (Top3 Goalscorer)
    const sortedTableData = formattedTableData?.sort(
      (a, b) => b.goals - a.goals
    );
    setMostValuable(sortedTableData?.slice(0, 3));
    setRow(
      sortedTableData?.map((row, index) => ({
        id: index,
        ...row,
      }))
    );
  }, [gameData, userGameData]);

  //Tabellen Spalten und Reihen
  const cols = columnsDataGrid;
  const colsSmall = columnsDataGridSmall;

  //HANDLER
  //Navigation zur Analysepage
  const handleAnalyseButton = () => {
    navigate(`/videoanalyse/${id}`);
  };
  //Navigation zu Spielerdetails
  const handleCellClick = (param) => {
    let home = true;
    param.row.team === userGameData.summary.homeTeam.name
      ? (home = true)
      : (home = false);

    const name = `${param.row.firstname} ${param.row.lastname}`;
    const events = eventData.length !== 0 ? eventData : userGameData.events;

    navigate(`/details/${id}/${param.row.firstname}_${param.row.lastname}`, {
      state: {
        player: param.row,
        opponent:
          userGameData.summary.homeTeam.name === param.row.team
            ? userGameData.summary.awayTeam.name
            : userGameData.summary.homeTeam.name,
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

  //Ladeanzeige/Fehlerhandling
  if (data.isLoading || !goalDataAwayTeam || !goalDataHomeTeam) {
    if (!data.isError) {
      return <LoadingCircle />;
    }
  }
  if (data.isError) {
    return <ErrorMessageServer />;
  }

  return (
    <div id="content">
      <Box m="1.5rem  2.5rem">
        <FlexBetween>
          <Header
            title="GAME DETAILS"
            subtitle={
              isNonMediumScreens
                ? `${gameData.summary.homeTeam.name} vs ${gameData.summary.awayTeam.name}`
                : `${gameData.summary.homeTeam.acronym} vs ${gameData.summary.awayTeam.acronym}`
            }
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
        <Box display="flex" flexDirection="column" justifyContent="flex-start">
          <Box
            mt="20px"
            display="grid"
            sx={{
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(8, 1fr)",
                xl: "repeat(8, 1fr)",
              },
              gridTemplateRows: {
                xs: "repeat(27, 100px)",
                sm: "repeat(26, 150px)",
                md: "repeat(16, 200px)",
                lg: "repeat(10, 200px)",
                xl: "repeat(10, 200px)",
              },
            }}
          >
            {/* ROW 1*/}
            {tableData?.length > 0 ? (
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
                sx={{
                  gridColumn: {
                    xs: "1",
                    sm: "1",
                    md: "1/3",
                    lg: "1/3",
                    xl: "1/3",
                  },
                  p: {
                    xs: "0.25rem 0.25rem",
                    sm: "0.5rem 0.25rem",
                    md: "0.75rem 0.5rem",
                    lg: "1rem 0.75rem",
                    xl: "1.25rem 1rem",
                  },
                  gridRow: {
                    xs: "2",
                    sm: "2",
                    md: "2",
                    lg: "1",
                    xl: "1",
                  },
                  m: {
                    xs: "0.125rem 0.0625rem",
                    sm: "0.125rem",
                    md: "0.25rem",
                    lg: "0.5rem",
                    xl: "0.5rem",
                  },
                }}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                flex="1 1 100%"
                backgroundColor={theme.palette.background.alt}
                borderRadius="0.55rem"
                className="data-display"
                border="1px solid #2f2b38"
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
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "1/3",
                  md: "1/5",
                  lg: "3/7",
                  xl: "3/7",
                },
                p: {
                  xs: "0.25rem 0.25rem",
                  sm: "0.5rem 0.25rem",
                  md: "0.75rem 0.5rem",
                  lg: "1rem 0.75rem",
                  xl: "1.25rem 1rem",
                },
                gridRow: {
                  xs: "1",
                  sm: "1",
                  md: "1",
                  lg: "1",
                  xl: "1",
                },
                m: {
                  xs: "0.125rem 0.0625rem",
                  sm: "0.125rem",
                  md: "0.25rem",
                  lg: "0.5rem",
                  xl: "0.5rem",
                },
              }}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              flex="1 1 100%"
              backgroundColor={theme.palette.background.alt}
              borderRadius="0.55rem"
              className="data-display"
            >
              <StatBoxGameInfo
                title={`${gameData.summary.phase.name}`}
                round={`${gameData.summary.round.name} - ${formatTimestamp(
                  gameData.summary.startsAt
                )}`}
                finalScore={`${gameData.summary.homeGoals ?? "0"} : ${
                  gameData.summary.awayGoals ?? "0"
                }`}
                halftimeScore={`(${gameData.summary.homeGoalsHalf ?? "0"} : ${
                  gameData.summary.awayGoalsHalf ?? "0"
                })`}
                homeTeam={gameData.summary.homeTeam.name}
                awayTeam={gameData.summary.awayTeam.name}
                homeGoals={gameData.summary.homeGoals}
                awayGoals={gameData.summary.awayGoals}
              />
            </Box>
            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "2",
                  md: "3/5",
                  lg: "7/9",
                  xl: "7/9",
                },
                gridRow: {
                  xs: "3",
                  sm: "2",
                  md: "2",
                  lg: "1",
                  xl: "1",
                },
                m: {
                  xs: "0.125rem 0.0625rem",
                  sm: "0.125rem",
                  md: "0.25rem",
                  lg: "0.5rem",
                  xl: "0.5rem",
                },
              }}
            >
              <SimpleStatBox
                value={gameData.summary.attendance}
                secondaryValue={gameData.summary.field.name}
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

            {/*Box 3th Column */}
            <PieChart data={sevenMeterData} title={"Siebenmetertore"} />
            {/*Box 4th column */}
            <PieChart
              data={goalDataHomeTeam}
              title={`Tore nach Positionen ${gameData.summary.homeTeam.name}`}
            />
            {/*Box 5th column */}
            {
              <PieChart
                data={goalDataAwayTeam}
                title={`Tore nach Positionen ${gameData.summary.awayTeam.name}`}
              />
            }
            {/*Box 6th column */}
            <PieChart data={technicalFoulsData} title={"Technische Fehler"} />
            {/*Box 7th column */}
            <PieChart data={missedShotsData} title={`Fehlwürfe`} />
            {/*Box 8th column */}
            <PieChart data={turnoverData} title={"Turnover"} />
            {/*Box 9th column */}
            <PieChart data={offensiveFoulData} title={"Stürmerfouls"} />
            {/*Box 10th column */}
            <PieChart data={fastbreakData} title={"Gegenstöße"} />
          </Box>
          <Box
            width="1fr"
            height="600px"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            mt="1rem"
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
                borderRight: ` 1px solid ${theme.palette.secondary[200]}`,
                borderBottom: ` 1px solid ${theme.palette.secondary[200]}`,
              },

              "& .MuiDataGrid-cell:last-child": {
                borderRight: "none",
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
              sx={{
                color: theme.palette.secondary[200],
                m: {
                  xs: "0.125rem 0.0625rem",
                  sm: "0.125rem",
                  md: "0.25rem",
                  lg: "0.5rem",
                  xl: "0.5rem",
                },
              }}
              textAlign="center"
            >
              Einzelstatistiken
            </Typography>
            <DataGrid
              rows={row || []}
              columns={isNonMediumScreens ? cols : colsSmall}
              components={{ ColumnMenu: CustomColumnMenu }}
              localeText={{
                noRowsLabel: "Noch keine Daten verfügbar",
              }}
              columnSeparator
              onCellClick={handleCellClick}
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
}
export default Details;
