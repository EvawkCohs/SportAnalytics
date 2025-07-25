import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Fade, Typography, useTheme } from "@mui/material";
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
  GetTotalSevenMeterGoalsData,
} from "./collectGamesAndDetails";
import SimpleStatBox from "components/SimpleStatBox";
import FlexBetween from "components/FlexBetween";
import { columnsDataGrid } from "scenes/dashboard/dataGridDefinitions";
import HalfCircleChart from "components/HalfCircleChart";
import { LoadingCircle } from "components/LoadingCircle";
import { ErrorMessageServer } from "components/ErrorMessageServer";
import { CustomSwitch } from "components/CustomSwitch";

const Dashboard = () => {
  const teamId = useSelector((state) => state.global.teamId);
  const teamName = useSelector((state) => state.global.teamName);
  const gender = useSelector((state) => state.global.genderMode);
  const theme = useTheme();
  const Navigate = useNavigate();

  const {
    data: games,
    isError,
    isLoadingGames,
  } = useGetGamesWithParticipationQuery(teamId);

  //Nächsten 5 Spiel
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
  const [totalSevenMeterGoals, setTotalSevenMeterGoals] = useState(0);
  const [averageSevenMeterGoals, setAverageSevenMeterGoals] = useState(0);

  //Zuschauer
  const [averageAttendance, setAverageAttendance] = useState(0);
  //periode
  const [periodData, setPeriodData] = useState([]);
  const [bestPeriod, setBestPeriod] = useState([]);
  const [worstPeriod, setWorstPeriod] = useState([]);
  const [isCheckedPeriod, setIsCheckedPeriod] = useState(false);
  //SpielerStatistik Gesamt
  const [overallLineup, setOverallLineup] = useState([]);
  //Tabellen Spalten und Reihen
  const [row, setRow] = useState();
  const cols = columnsDataGrid;

  //HANDLER SECTION
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
  //StatboxSwitch für Tore
  const [isSwitchToreChecked, setIsSwitchToreChecked] = useState(true);
  const handleSwitchToreChange = (event) => {
    setIsSwitchToreChecked(event.target.checked);
  };
  //StatboxSwitch für Gegentore
  const [isSwitchGegentoreChecked, setIsSwitchGegentoreChecked] =
    useState(true);
  const handleSwitchGegentoreChange = (event) => {
    setIsSwitchGegentoreChecked(event.target.checked);
  };
  //StatboxSwitch für 7m-Tore
  const [isSwitch7mToreChecked, setIsSwitch7mToreChecked] = useState(true);
  const handleSwitch7mToreChange = (event) => {
    setIsSwitch7mToreChecked(event.target.checked);
  };

  //USEEFFECT SECTION
  //Statistiken berechnen
  useEffect(() => {
    if (isLoadingGames || !games) return;
    if (games.length < 30 && gender === "male") return;
    if (games.length < 22 && gender === "female") return;

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
    if (overallLineup.length < 1) return;
    setTotalSevenMeterGoals(GetTotalSevenMeterGoalsData(overallLineup));
    setAverageSevenMeterGoals(
      totalSevenMeterGoals /
        games.filter((game) => game.summary.homeGoals > 0).length
    );
  }, [
    isLoadingGames,
    games,
    totalGoals,
    totalGoalsConceded,
    totalSevenMeterGoals,
  ]);

  //beste und schlechteste Periode
  useEffect(() => {
    setIsCheckedPeriod(true);
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
  if (isError) {
    return <ErrorMessageServer />;
  }
  if (isLoadingGames || !updatedNextFiveGames || !dataLastFiveGames) {
    return <LoadingCircle />;
  }

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title={teamName} subtitle={"Dashboard"} />
      </FlexBetween>
      <Box display="flex" flexDirection="column" justifyContent="flex-start">
        <Box
          display="grid"
          sx={{
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(6, 1fr)",
              xl: "repeat(8, 1fr)",
            },
            gridTemplateRows: {
              xs: "repeat(10, 100px)",
              sm: "repeat(5, 150px)",
              md: "repeat(5, 200px)",
              lg: "repeat(4, 250px)",
              xl: "repeat(3, 300px)",
            },
          }}
        >
          {/*Row 1 */}
          {/*Nächstes Spiel */}
          <Fade in={isCheckedPeriod} timeout={500}>
            <Box
              gridRow="1"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              flex="1 1 100%"
              backgroundColor={theme.palette.background.alt}
              borderRadius="0.55rem"
              className="data-display"
              sx={{
                p: {
                  xs: "0.25rem 0.25rem",
                  sm: "0.5rem 0.25rem",
                  md: "0.75rem 0.5rem",
                  lg: "1rem 0.75rem",
                  xl: "1.25rem 1rem",
                },
                gridColumn: {
                  xs: "1",
                  sm: "1",
                  md: "1/3",
                  lg: "1/4",
                  xl: "1/5",
                },
                m: {
                  xs: "0.125rem 0.0625rem",
                  sm: "0.5rem .125rem",
                  md: "1rem .25rem",
                  lg: "1.5rem .5rem",
                  xl: "2rem .5rem",
                },
              }}
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
                    sx={{ color: theme.palette.secondary[200] }}
                    variant="h2"
                  >
                    Nächstes Spiel noch nicht verfügbar!
                  </Typography>
                </Box>
              )}
            </Box>
          </Fade>
          {/*Letztes Spiel */}
          <Fade in={isCheckedPeriod} timeout={500}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              flex="1 1 100%"
              backgroundColor={theme.palette.background.alt}
              borderRadius="0.55rem"
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

                p: {
                  xs: "0.25rem 0.25rem",
                  sm: "0.5rem 0.25rem",
                  md: "0.75rem 0.5rem",
                  lg: "1rem 0.75rem",
                  xl: "1.25rem 1rem",
                },
                gridColumn: {
                  xs: "1",
                  sm: "2",
                  md: "3/5",
                  lg: "4/7",
                  xl: "5/9",
                },
                m: {
                  xs: "0.125rem 0.0625rem",
                  sm: "0.5rem .125rem",
                  md: "1rem .25rem",
                  lg: "1.5rem .5rem",
                  xl: "2rem .5rem",
                },
              }}
            >
              {dataLastFiveGames.length > 0 ? (
                <StatBoxGameInfo
                  title={`Letztes Spiel`}
                  round={`${
                    dataLastFiveGames[0].summary.round.name
                  } - ${formatTimestamp(
                    dataLastFiveGames[0].summary.startsAt
                  )}`}
                  finalScore={`${
                    dataLastFiveGames[0].summary.homeGoals ?? "0"
                  } : ${dataLastFiveGames[0].summary.awayGoals ?? "0"}`}
                  halftimeScore={`(${
                    dataLastFiveGames[0].summary.homeGoalsHalf ?? "0"
                  } : ${dataLastFiveGames[0].summary.awayGoalsHalf ?? "0"})`}
                  homeTeam={dataLastFiveGames[0].summary.homeTeam.name}
                  awayTeam={dataLastFiveGames[0].summary.awayTeam.name}
                  state="post"
                  homeGoals={dataLastFiveGames[0].summary.homeGoals}
                  awayGoals={dataLastFiveGames[0].summary.awayGoals}
                />
              ) : (
                <Box>
                  <Typography
                    sx={{ color: theme.palette.secondary[200] }}
                    variant="h2"
                  >
                    letztes Spiel
                  </Typography>
                  <Typography
                    sx={{ color: theme.palette.secondary[200] }}
                    variant="h2"
                  >
                    noch keine Spiele gespielt
                  </Typography>
                </Box>
              )}
            </Box>
          </Fade>
          {/*Row 1 */}

          {/*Tore gesamte Saison */}

          <Box
            sx={{
              gridColumn: { xs: "1", sm: "1", md: "1/3", lg: "1/3", xl: "1/3" },
              gridRow: { xs: "3", sm: "2", md: "2", lg: "2", xl: "2" },
              m: {
                xs: "0.125rem 0.0625rem",
                sm: "0.125rem",
                md: "0.25rem",
                lg: "0.5rem",
                xl: "0.5rem",
              },
            }}
            display="flex"
            position={"relative"}
          >
            <Box sx={{ position: "absolute", top: "8%", left: "83%" }}>
              <CustomSwitch
                checked={isSwitchToreChecked}
                onChange={handleSwitchToreChange}
              />
            </Box>
            <SimpleStatBox
              title={
                isSwitchToreChecked ? "Tore gesamt" : "Durchschnittliche Tore"
              }
              value={
                isSwitchToreChecked
                  ? totalGoals
                  : `Ø ${
                      Number.isInteger(averageGoals)
                        ? averageGoals
                        : averageGoals.toFixed(2)
                    }`
              }
              secondaryValue={"in dieser Saison"}
            />
          </Box>
          {/*Gegentore gesamte Saison */}
          <Box
            display="flex"
            sx={{
              gridColumn: { xs: "1", sm: "1", md: "1/3", lg: "3/5", xl: "1/3" },
              gridRow: { xs: "7", sm: "4", md: "4", lg: "3", xl: "3" },
              m: {
                xs: "0.125rem 0.0625rem",
                sm: "0.125rem",
                md: "0.25rem",
                lg: "0.5rem",
                xl: "0.5rem",
              },
            }}
            position={"relative"}
          >
            <Box sx={{ position: "absolute", top: "8%", left: "83%" }}>
              <CustomSwitch
                checked={isSwitchGegentoreChecked}
                onChange={handleSwitchGegentoreChange}
              />
            </Box>
            <SimpleStatBox
              title={
                isSwitchGegentoreChecked
                  ? "Gegentore gesamt"
                  : "Durchschnittliche Gegentore"
              }
              value={
                isSwitchGegentoreChecked
                  ? totalGoalsConceded
                  : `Ø ${
                      Number.isInteger(averageGoalsConceded)
                        ? averageGoalsConceded
                        : averageGoalsConceded.toFixed(2)
                    }`
              }
              secondaryValue={"in dieser Saison"}
            />
          </Box>
          {/*Tore Durchschnitt Saison */}
          <Box
            display="flex"
            sx={{
              gridColumn: { xs: "1", sm: "2", md: "3/5", lg: "3/5", xl: "3/5" },
              gridRow: { xs: "4", sm: "2", md: "2", lg: "2", xl: "2" },
              m: {
                xs: "0.125rem 0.0625rem",
                sm: "0.125rem",
                md: "0.25rem",
                lg: "0.5rem",
                xl: "0.5rem",
              },
            }}
            position={"relative"}
          >
            <Box sx={{ position: "absolute", top: "8%", left: "83%" }}>
              <CustomSwitch
                checked={isSwitch7mToreChecked}
                onChange={handleSwitch7mToreChange}
              />
            </Box>
            <SimpleStatBox
              title={
                isSwitch7mToreChecked
                  ? "7m-Tore gesamt"
                  : "Durchnittliche 7m-Tore"
              }
              value={
                isSwitch7mToreChecked
                  ? totalSevenMeterGoals
                  : `Ø ${
                      Number.isInteger(averageSevenMeterGoals)
                        ? averageSevenMeterGoals
                        : averageSevenMeterGoals.toFixed(2)
                    }`
              }
              secondaryValue={"in dieser Saison"}
            />
          </Box>
          {/*Gegentore Durchschnitt Saison */}
          <Box
            display="flex"
            sx={{
              gridColumn: { xs: "1", sm: "2", md: "3/5", lg: "5/7", xl: "3/5" },
              gridRow: { xs: "8", sm: "4", md: "4", lg: "3", xl: "3" },
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
              title={"Durchschnittliche Gegentore"}
              value={`Ø ${
                Number.isInteger(averageGoalsConceded)
                  ? averageGoalsConceded
                  : averageGoalsConceded.toFixed(2)
              }`}
              secondaryValue={"in dieser Saison"}
            />
          </Box>

          {/*Tore Durchschnitt letzte 5 Spiele */}
          <Fade in={isCheckedPeriod} timeout={500}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              backgroundColor={theme.palette.background.alt}
              borderRadius="0.55rem"
              className="data-display"
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "1",
                  md: "1/3",
                  lg: "5/7",
                  xl: "5/7",
                },
                gridRow: { xs: "5", sm: "3", md: "3", lg: "2", xl: "2" },
                p: {
                  xs: "0.25rem 0.125rem",
                  sm: "0.5rem 0.25rem",
                  md: "0.75rem 0.5rem",
                  lg: "1rem 0.75rem",
                  xl: "1.25rem 1rem",
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
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.secondary[200],
                }}
                textAlign="center"
              >
                Durchschnittliche Tore
              </Typography>
              <Box
                display="flex"
                justifyContent="center"
                sx={{
                  mt: {
                    xs: "0rem",
                    sm: "0.5rem",
                    md: "0.5rem",
                    lg: "1rem",
                    xl: "1rem",
                  },
                  mb: {
                    xs: "0.25rem",
                    sm: "0",
                    md: "0",
                    lg: "0",
                    xl: "0",
                  },
                }}
              >
                <HalfCircleChart
                  value={averageGoalsLastFive}
                  compareValue={averageGoals}
                  mode="high"
                />
              </Box>
              <Typography
                sx={{ color: theme.palette.secondary[200] }}
                variant="h4"
                textAlign="center"
              >
                in den letzten 5 Spielen
              </Typography>
            </Box>
          </Fade>
          {/*Gegentor Durchschnitt letzte 5 Spiele */}
          <Fade in={isCheckedPeriod} timeout={500}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              backgroundColor={theme.palette.background.alt}
              borderRadius="0.55rem"
              className="data-display"
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "1",
                  md: "1/3",
                  lg: "1/3",
                  xl: "5/7",
                },
                gridRow: { xs: "9", sm: "5", md: "5", lg: "4", xl: "3" },
                p: {
                  xs: "0.25rem 0.125rem",
                  sm: "0.5rem 0.25rem",
                  md: "0.75rem 0.5rem",
                  lg: "1rem 0.75rem",
                  xl: "1.25rem 1rem",
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
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.secondary[200],
                }}
                textAlign="center"
              >
                Durchschnittliche Gegentore
              </Typography>
              <Box
                display="flex"
                justifyContent="center"
                sx={{
                  mt: {
                    xs: "0rem",
                    sm: "0.5rem",
                    md: "0.5rem",
                    lg: "1rem",
                    xl: "1rem",
                  },
                  mb: {
                    xs: "0.25rem",
                    sm: "0",
                    md: "0",
                    lg: "0",
                    xl: "0",
                  },
                }}
              >
                <HalfCircleChart
                  value={averageGoalsLastFiveConceded}
                  compareValue={averageGoalsConceded}
                  mode="low"
                />
              </Box>
              <Typography
                sx={{ color: theme.palette.secondary[200] }}
                variant="h4"
                textAlign="center"
              >
                in den letzten 5 Spielen
              </Typography>
            </Box>
          </Fade>
          {/*Bester/Schlechtester Abschnitt */}
          <Fade in={isCheckedPeriod} timeout={500}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              backgroundColor={theme.palette.background.alt}
              borderRadius="0.55rem"
              className="data-display"
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "2",
                  md: "3/5",
                  lg: "1/3",
                  xl: "7/9",
                },
                gridRow: { xs: "6", sm: "3", md: "3", lg: "3", xl: "2" },
                p: {
                  xs: "0.25rem 0.125rem",
                  sm: "0.5rem 0.25rem",
                  md: "0.75rem 0.5rem",
                  lg: "1rem 0.75rem",
                  xl: "1.25rem 1rem",
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
              <Typography
                variant="h3"
                sx={{
                  color: theme.palette.secondary[200],
                }}
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
                  sx={{
                    color: theme.palette.green[100],
                  }}
                  textAlign="center"
                >
                  Ø {bestPeriod[1]} Tore
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    color: theme.palette.red[600],
                  }}
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
                  sx={{ color: theme.palette.secondary[200] }}
                  variant="h4"
                >
                  {bestPeriod[0]}
                </Typography>
                <Typography
                  sx={{ color: theme.palette.secondary[200] }}
                  variant="h4"
                >
                  {worstPeriod[0]}
                </Typography>
              </Box>
            </Box>
          </Fade>
          {/*Zuschauerschnitt */}
          <Box
            display="flex"
            sx={{
              gridColumn: { xs: "1", sm: "2", md: "3/5", lg: "3/5", xl: "7/9" },
              gridRow: { xs: "10", sm: "5", md: "5", lg: "4", xl: "3" },
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
              title={"Zuschauerschnitt"}
              value={averageAttendance}
              secondaryValue={"bei Heimspielen dieser Saison"}
            />
          </Box>
        </Box>
        <Fade in={isCheckedPeriod} timeout={500}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
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
                fontSize: {
                  xs: "0.375rem",
                  sm: "0.5rem",
                  md: "0.625rem",
                  lg: "0.750rem",
                  xl: "0.875rem",
                },
              },

              "& .MuiDataGrid-columnHeaders": {
                color: theme.palette.secondary[200],
                borderBottom: "none",
                fontSize: {
                  xs: "0.25rem",
                  sm: "0.5rem",
                  md: "0.75rem",
                  lg: "1rem",
                  xl: "1.25rem",
                },
              },
              "& .MuiDataGrid-row": {
                "&:hover": {
                  backgroundColor: theme.palette.primary[600],
                  cursor: "pointer",
                },
              },
              "& .MuiDataGrid-overlay": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[200],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: {
                  xs: "0.25rem",
                  sm: "0.5rem",
                  md: "0.75rem",
                  lg: "1rem",
                  xl: "1.25rem",
                },
                fontWeight: "bold",
              },
              "& .MuiDataGrid-footerContainer": {
                display: "none",
              },
              m: {
                xs: "0.125rem 0.0625rem",
                sm: "0.5rem .125rem",
                md: "1rem .25rem",
                lg: "1.5rem .5rem",
                xl: "2rem .5rem",
              },
              p: {
                xs: "0.25rem 0.25rem",
                sm: "0.5rem 0.25rem",
                md: "0.75rem 0.5rem",
                lg: "1rem 0.75rem",
                xl: "1.25rem 1rem",
              },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: theme.palette.secondary[200],
              }}
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
