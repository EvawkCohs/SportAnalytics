import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Fade, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import { useGetGamesWithParticipationQuery } from "state/api";

import StatBoxGameInfo from "components/StatBoxGameInfo";
import formatTimestamp from "conversionScripts/formatTimestamp";
import { useNavigate } from "react-router-dom";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";
import {
  GetTotalGoals,
  GetAverageGoalsLastFive,
  GetAverageAttendance,
  GetBestPeriodLastFive,
  GetOverallLineupData,
  GetTotalGoalsConceded,
  GetAverageGoalsConcededLastFive,
} from "./collectGamesAndDetails";
import SimpleStatBox from "components/SimpleStatBox";
import FlexBetween from "components/FlexBetween";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { columnsDataGrid } from "scenes/dashboard/dataGridDefinitions";

const Dashboard = () => {
  const teamId = useSelector((state) => state.global.teamId);
  const teamName = useSelector((state) => state.global.teamName);
  const theme = useTheme();
  const Navigate = useNavigate();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const {
    data: games,
    errorGames,
    isLoadingGames,
  } = useGetGamesWithParticipationQuery(teamId);

  //Nächsten 5 Spiele

  const updatedNextFiveGames = games
    ?.filter((game) => new Date(game.summary.startsAt).getTime() > Date.now())
    .sort((a, b) => new Date(a.summary.startsAt) - new Date(b.summary.startsAt))
    .slice(0, 5);
  // letzten 5 Spiele
  const dataLastFiveGames = games
    ?.filter((game) => new Date(game.summary.startsAt).getTime() < Date.now())
    .sort((a, b) => new Date(b.summary.startsAt) - new Date(a.summary.startsAt))
    .slice(0, 5);
  //Tore
  const [totalGoals, setTotalGoals] = useState(0);
  const [totalGoalsConceded, setTotalGoalsConceded] = useState(0);
  const [averageGoals, setAverageGoals] = useState(0);
  const [averageGoalsLastFive, setAverageGoalsLastFive] = useState(0);
  const [averageGoalsConceded, setAverageGoalsConceded] = useState(0);
  const [averageGoalsLastFiveConceded, setAverageGoalsLastFiveConceded] =
    useState(0);
  //Zuschauer
  const [averageAttendance, setAverageAttendance] = useState(0);
  //periode
  const [periodData, setPeriodData] = useState([]);
  const [bestPeriod, setBestPeriod] = useState([]);
  const [worstPeriod, setWorstPeriod] = useState([]);
  //SpielerStatistik Gesamt
  const [overallLineup, setOverallLineup] = useState([]);
  //Tabellen Spalten und Reihen
  const [row, setRow] = useState();
  const cols = columnsDataGrid;

  //OnClick zu GameDetails(letztes Spiel)
  const handleCellClickLastGame = () => {
    Navigate(`/details/${dataLastFiveGames[0].summary.id}`);
  };

  //OnClick zu Spielerdetails
  const handleCellClickPlayerDetails = (param) => {
    Navigate(`/dashboard/playerDetails/${param.row.id}`, {
      state: { player: param.row, allGamesDetails: games },
    });
  };
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (isLoadingGames || !games || games.length !== 30) return;

    //Tore
    setTotalGoals(GetTotalGoals(games, teamId));
    setTotalGoalsConceded(GetTotalGoalsConceded(games, teamId));

    //Torschnitt
    setAverageGoals(
      totalGoals / games.filter((game) => game.summary.homeGoals > 0).length
    );
    setAverageGoalsConceded(
      totalGoalsConceded /
        games.filter((game) => game.summary.homeGoals > 0).length
    );
    //Torschnitt letzte 5

    setAverageGoalsLastFive(GetAverageGoalsLastFive(dataLastFiveGames, teamId));
    setAverageGoalsLastFiveConceded(
      GetAverageGoalsConcededLastFive(dataLastFiveGames, teamId)
    );
    //Zuschauerschnitt

    setAverageAttendance(GetAverageAttendance(games, teamId).toFixed(0));
    //Period Data
    setPeriodData(GetBestPeriodLastFive(dataLastFiveGames, teamId));
    setOverallLineup(GetOverallLineupData(games, teamId));
    setRow(
      overallLineup.map((row, index) => ({
        id: index,
        ...row,
        flex: 1,
      }))
    );
  }, [isLoadingGames, games, totalGoals, totalGoalsConceded]);

  //beste und schlechteste Periode
  useEffect(() => {
    setIsChecked(true);
    if (
      !periodData ||
      periodData === undefined ||
      periodData.length < 1 ||
      Number.isNaN(Object.values(periodData[0])[1])
    )
      return;

    const [bestPeriodKey, bestPeriodValue] = Object.entries(
      periodData[0]
    ).reduce(
      (max, [key, value]) => (value > max[1] ? [key, value] : max),
      ["", -Infinity]
    );
    const [worstPeriodKey, worstPeriodValue] = Object.entries(
      periodData[0]
    ).reduce(
      (min, [key, value]) => (value < min[1] ? [key, value] : min),
      ["", Infinity]
    );
    setBestPeriod([bestPeriodKey, bestPeriodValue.toFixed(2)]);
    setWorstPeriod([worstPeriodKey, worstPeriodValue.toFixed(2)]);
  }, [periodData]);
  if (errorGames) {
    return <div>Fehler beim Laden der Daten</div>;
  }
  if (
    isLoadingGames ||
    !updatedNextFiveGames ||
    updatedNextFiveGames.length < 5 ||
    !dataLastFiveGames ||
    dataLastFiveGames.length < 1
  ) {
    return <div>Loading....</div>; // Später noch Ladekreis einbauen oder etwas vergleichbares
  }

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title={teamName} subtitle={"Überblick"} gridColumn="span 6" />
      </FlexBetween>
      <Box
        display="grid"
        gridTemplateColumns="repeat(8, 1fr)"
        gridTemplateRows="repeat(12, 300px)"
        sx={{
          "& > div": {
            gridColumn: isNonMediumScreens ? undefined : "span 12",
          },
        }}
      >
        {/*Row 1 */}
        {/*Nächstes Spiel */}
        <Fade in={isChecked} timeout={500}>
          <Box
            gridColumn="1/5"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            p="1.25rem 1rem"
            flex="1 1 100%"
            backgroundColor={theme.palette.primary[700]}
            borderRadius="0.55rem"
            m="2rem .5rem "
            className="data-display"
          >
            {updatedNextFiveGames.length > 0 ? (
              <StatBoxGameInfo
                title={`Nächstes Spiel`}
                round={`${
                  updatedNextFiveGames[0].summary.round.name
                } - ${formatTimestamp(
                  updatedNextFiveGames[0].summary.startsAt
                )}`}
                finalScore={`${
                  updatedNextFiveGames[0].summary.homeGoals ?? "0"
                } : ${updatedNextFiveGames[0].summary.awayGoals ?? "0"}`}
                halftimeScore={`(${
                  updatedNextFiveGames[0].summary.homeGoalsHalf ?? "0"
                } : ${updatedNextFiveGames[0].summary.awayGoalsHalf ?? "0"})`}
                homeTeam={updatedNextFiveGames[0].summary.homeTeam.name}
                awayTeam={updatedNextFiveGames[0].summary.awayTeam.name}
                state="pre"
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
        </Fade>
        {/*Letztes Spiel */}
        <Fade in={isChecked} timeout={500}>
          <Box
            gridColumn="5/9"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            p="1.25rem 1rem"
            flex="1 1 100%"
            backgroundColor={theme.palette.primary[700]}
            borderRadius="0.55rem"
            m="2rem .5rem "
            onClick={handleCellClickLastGame}
            className="data-display"
            sx={{
              transition: `transform 0.3s ease`,
              ":hover": {
                transform: `translateY(-1rem)`,
                cursor: "pointer",
                border: `2px solid ${theme.palette.secondary[400]}`,
                boxShadow: `0 0 8px ${theme.palette.secondary[500]}`,
              },
            }}
          >
            {dataLastFiveGames.length > 0 ? (
              <StatBoxGameInfo
                title={`Letztes Spiel`}
                round={`${
                  dataLastFiveGames[0].summary.round.name
                } - ${formatTimestamp(dataLastFiveGames[0].summary.startsAt)}`}
                finalScore={`${
                  dataLastFiveGames[0].summary.homeGoals ?? "0"
                } : ${dataLastFiveGames[0].summary.awayGoals ?? "0"}`}
                halftimeScore={`(${
                  dataLastFiveGames[0].summary.homeGoalsHalf ?? "0"
                } : ${dataLastFiveGames[0].summary.awayGoalsHalf ?? "0"})`}
                homeTeam={dataLastFiveGames[0].summary.homeTeam.name}
                awayTeam={dataLastFiveGames[0].summary.awayTeam.name}
                state="post"
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
        </Fade>
        {/*Row 1 */}
        {/*Tore gesamte Saison */}
        <Box gridColumn="1/3" display="flex" m="0.5rem  " gridRow="2">
          <SimpleStatBox
            title={"Tore gesamt"}
            value={totalGoals}
            secondaryValue={"in dieser Saison"}
          />
        </Box>
        {/*Gegentore gesamte Saison */}
        <Box gridColumn="1/3" display="flex" m="0.5rem  " gridRow="3">
          <SimpleStatBox
            title={"Gegentore gesamt"}
            value={totalGoalsConceded}
            secondaryValue={"in dieser Saison"}
          />
        </Box>
        {/*Tore Durchschnitt Saison */}
        <Box gridColumn="3/5" display="flex" m="0.5rem " gridRow="2">
          <SimpleStatBox
            title={"Durschnittliche Tore"}
            value={`Ø ${
              Number.isInteger(averageGoals)
                ? averageGoals
                : averageGoals.toFixed(2)
            }`}
            secondaryValue={"in dieser Saison"}
          />
        </Box>
        {/*Gegentore Durchschnitt Saison */}
        <Box gridColumn="3/5" display="flex" m="0.5rem " gridRow="3">
          <SimpleStatBox
            title={"Durschnittliche Gegentore"}
            value={`Ø ${
              Number.isInteger(averageGoalsConceded)
                ? averageGoalsConceded
                : averageGoalsConceded.toFixed(2)
            }`}
            secondaryValue={"in dieser Saison"}
          />
        </Box>

        {/*Tore Durchschnitt letzte 5 Spiele */}
        <Fade in={isChecked} timeout={500}>
          <Box
            gridColumn="5/7"
            display="flex"
            m="0.5rem "
            gridRow="2"
            flexDirection="column"
            justifyContent="flex-start"
            backgroundColor={theme.palette.primary[700]}
            borderRadius="0.55rem"
            p="1.25rem 1rem"
            className="data-display"
          >
            <Typography
              variant="h2"
              sx={{ color: theme.palette.secondary[200] }}
              textAlign="center"
              mb="4.5rem"
            >
              Durchschnittliche Tore
            </Typography>
            <Typography
              variant="h2"
              sx={{ color: theme.palette.secondary[200] }}
              textAlign="center"
              mb="1.25rem"
            >
              Ø{" "}
              {Number.isInteger(averageGoalsLastFive)
                ? averageGoalsLastFive
                : averageGoalsLastFive.toFixed(2)}
            </Typography>
            {averageGoalsLastFive >= averageGoals ? (
              <Box
                alignItems="center"
                display="flex"
                flexDirection="row"
                justifyContent="center"
                gap="0.5rem"
              >
                <TrendingUpIcon sx={{ color: "green" }} fontSize="large" />
                <Typography
                  variant="h4"
                  sx={{ color: "green" }}
                  textAlign="center"
                >
                  +{" "}
                  {Number.isInteger(
                    (averageGoalsLastFive / averageGoals - 1) * 100
                  )
                    ? (averageGoalsLastFive / averageGoals - 1) * 100
                    : ((averageGoalsLastFive / averageGoals - 1) * 100).toFixed(
                        2
                      )}{" "}
                  %
                </Typography>
              </Box>
            ) : (
              <Box
                alignItems="center"
                display="flex"
                flexDirection="row"
                justifyContent="center"
                gap="0.5rem"
              >
                <TrendingDownIcon
                  sx={{ color: theme.palette.red[500] }}
                  fontSize="large"
                />
                <Typography
                  variant="h4"
                  sx={{ color: theme.palette.red[500] }}
                  textAlign="center"
                >
                  -{" "}
                  {Number.isInteger(
                    (1 - averageGoalsLastFive / averageGoals) * 100
                  )
                    ? (1 - averageGoalsLastFive / averageGoals) * 100
                    : ((1 - averageGoalsLastFive / averageGoals) * 100).toFixed(
                        2
                      )}
                  %
                </Typography>
              </Box>
            )}
            <Typography
              variant="h4"
              sx={{ color: theme.palette.secondary[200] }}
              textAlign="center"
              mt="1.25rem"
            >
              in den letzten 5 Spielen
            </Typography>
          </Box>
        </Fade>
        {/*Gegentor Durchschnitt letzte 5 Spiele */}
        <Fade in={isChecked} timeout={500}>
          <Box
            gridColumn="5/7"
            display="flex"
            m="0.5rem "
            gridRow="3"
            flexDirection="column"
            justifyContent="flex-start"
            backgroundColor={theme.palette.primary[700]}
            borderRadius="0.55rem"
            p="1.25rem 1rem"
            className="data-display"
          >
            <Typography
              variant="h2"
              sx={{ color: theme.palette.secondary[200] }}
              textAlign="center"
              mb="4.5rem"
            >
              Durchschnittliche Gegentore
            </Typography>
            <Typography
              variant="h2"
              sx={{ color: theme.palette.secondary[200] }}
              textAlign="center"
              mb="1.25rem"
            >
              Ø{" "}
              {Number.isInteger(averageGoalsLastFiveConceded)
                ? averageGoalsLastFiveConceded
                : averageGoalsLastFiveConceded.toFixed(2)}
            </Typography>
            {averageGoalsLastFiveConceded >= averageGoalsConceded ? (
              <Box
                alignItems="center"
                display="flex"
                flexDirection="row"
                justifyContent="center"
                gap="0.5rem"
              >
                <TrendingUpIcon
                  sx={{ color: theme.palette.red[500] }}
                  fontSize="large"
                />
                <Typography
                  variant="h4"
                  sx={{ color: theme.palette.red[500] }}
                  textAlign="center"
                >
                  +{" "}
                  {Number.isInteger(
                    (averageGoalsLastFiveConceded / averageGoalsConceded - 1) *
                      100
                  )
                    ? (averageGoalsLastFiveConceded / averageGoalsConceded -
                        1) *
                      100
                    : (
                        (averageGoalsLastFiveConceded / averageGoalsConceded -
                          1) *
                        100
                      ).toFixed(2)}{" "}
                  %
                </Typography>
              </Box>
            ) : (
              <Box
                alignItems="center"
                display="flex"
                flexDirection="row"
                justifyContent="center"
                gap="0.5rem"
              >
                <TrendingDownIcon sx={{ color: "green" }} fontSize="large" />
                <Typography
                  variant="h4"
                  sx={{ color: "green" }}
                  textAlign="center"
                >
                  -{" "}
                  {Number.isInteger(
                    (1 - averageGoalsLastFiveConceded / averageGoalsConceded) *
                      100
                  )
                    ? (1 -
                        averageGoalsLastFiveConceded / averageGoalsConceded) *
                      100
                    : (
                        (1 -
                          averageGoalsLastFiveConceded / averageGoalsConceded) *
                        100
                      ).toFixed(2)}
                  %
                </Typography>
              </Box>
            )}
            <Typography
              variant="h4"
              sx={{ color: theme.palette.secondary[200] }}
              textAlign="center"
              mt="1.25rem"
            >
              in den letzten 5 Spielen
            </Typography>
          </Box>
        </Fade>
        {/*Bester/Schlechtester Abschnitt */}
        <Fade in={isChecked} timeout={500}>
          <Box
            gridColumn="7/9"
            display="flex"
            m="0.5rem "
            gridRow="2"
            flexDirection="column"
            justifyContent="space-between"
            backgroundColor={theme.palette.primary[700]}
            borderRadius="0.55rem"
            p="1.25rem 1rem"
            className="data-display"
          >
            <Typography
              variant="h2"
              sx={{ color: theme.palette.secondary[200] }}
              textAlign="center"
            >
              Bester / Schlechtester Abschnitt letzte 5 Spiele
            </Typography>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-evenly"
            >
              <Typography
                variant="h2"
                sx={{ color: "green" }}
                textAlign="center"
              >
                Ø {bestPeriod[1]} Tore
              </Typography>
              <Typography
                variant="h2"
                sx={{ color: theme.palette.red[600] }}
                textAlign="center"
              >
                Ø {worstPeriod[1]} Tore
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-evenly"
              mt="2rem"
            >
              <Typography
                variant="h4"
                sx={{ color: theme.palette.secondary[200] }}
                textAlign="center"
              >
                Zwischen {bestPeriod[0]}
              </Typography>
              <Typography
                variant="h4"
                sx={{ color: theme.palette.secondary[200] }}
                textAlign="center"
              >
                Zwischen {worstPeriod[0]}
              </Typography>
            </Box>
          </Box>
        </Fade>
        {/*Zuschauerschnitt */}
        <Box gridColumn="7/9" display="flex" m="0.5rem  " gridRow="3">
          <SimpleStatBox
            title={"Zuschauerschnitt"}
            value={averageAttendance}
            secondaryValue={"bei Heimspielen dieser Saison"}
          />
        </Box>
        <Fade in={isChecked} timeout={500}>
          <Box
            gridColumn="span 8"
            gridRow="4/7"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            p="1.25rem 1rem"
            flex="1 1 100%"
            backgroundColor={theme.palette.background.alt}
            borderRadius="0.55rem"
            m="0.5rem"
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
              "& .MuiDataGrid-row": {
                "&:hover": {
                  backgroundColor: theme.palette.primary[600],
                  cursor: "pointer",
                },
              },
              "& .MuiDataGrid-overlay": {
                // Styling for the 'No Rows' overlay
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[200],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-footerContainer": {
                display: "none", // Ausblenden des Footers
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
              components={{ ColumnMenu: CustomColumnMenu, Footer: null }}
              localeText={{
                noRowsLabel: "Noch keine Daten verfügbar",
              }}
              onCellClick={handleCellClickPlayerDetails}
            />
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};
export default Dashboard;
