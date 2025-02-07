import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation, useNavigate } from "react-router-dom";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";
import { Box, useMediaQuery, Typography, Fade } from "@mui/material";
import {
  GetPlayerGoalsDataLine,
  GetPlayerStatisticsPerGame,
} from "./formatData";
import LineChart from "components/LineChartPlayerDetails";
import { useTheme } from "@emotion/react";
import SimpleStatBox from "components/SimpleStatBox";
import { columnsDataGrid,columnsDataGridSmall } from "./dataGridDefinitions";

const PlayerDetailsCombined = () => {
  const location = useLocation();
  const Navigate = useNavigate();
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1000px)");
  const overallPlayerStatistics = location.state?.player;
  const teamId = useSelector((state) => state.global.teamId);
  const playerId = location.state?.player.id;
  const allGamesDetails = location.state?.allGamesDetails.sort(
    (a, b) => new Date(a.summary.startsAt) - new Date(b.summary.startsAt)
  );

  const playerStatisticsPerGame = GetPlayerStatisticsPerGame(
    allGamesDetails,
    playerId,
    teamId
  );
  const opponentList = playerStatisticsPerGame.map((game) => game.opponent);
  const playerGoalDataLine = GetPlayerGoalsDataLine(playerStatisticsPerGame);

  const totalGoals = overallPlayerStatistics.goals;
  const averageGoals =
    overallPlayerStatistics.goals / playerGoalDataLine[0].data.length;
  const penaltyPercentage =
    (overallPlayerStatistics.penaltyGoals /
      (overallPlayerStatistics.penaltyGoals +
        overallPlayerStatistics.penaltyMissed)) *
    100;
  const [row, setRow] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const cols = columnsDataGrid;
  const handleCellClick = (params)=>{
    
    //const id = allGamesDetails[index]
    Navigate(`/details/${params.row.gameId}`);
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsChecked(true);
    setRow(
      playerStatisticsPerGame.map((row) => ({
        ...row,
        id: row._id,
        flex: 1,
      }))
    );
  }, [location]);

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
      
        
        
        sx={{
          gridTemplateColumns:{
            xs: "repeat(6, 1fr)",
            sm: "repeat(6, 1fr)",
            md:"repeat(6, 1fr)",
            lg:"repeat(8, 1fr)",
            xl:"repeat(8, 1fr)"

          },
          gridTemplateRows:{
            xs: "repeat(14, 150px)",
            sm:"repeat(14, 150px)",
            md:"repeat(14, 150px)",
            lg:"repeat(14, 150px)",
            xl:"repeat(14, 150px)"
          },
          gap:{
          xs: "0.125rem 0.0625rem",
          sm: "0.125rem",
          md: "0.25rem",
          lg: "0.5rem",
          xl: "0.5rem",}
        }}
      >
        {/*ROW 1 - 5 */}
        {/*Tore pro Spiel Chart ROW 1-5*/}

        <LineChart data={playerGoalDataLine} opponents={opponentList} />

        {/*GamesPlayed ROW 1*/}
        <Box sx={{gridColumn: {
          xs: "1/3", sm: "1/3", md:"1/3", lg: "7/9", xl: "7/9"
        }, gridRow: {xs: "5", sm: "5", md:"5", lg:"1", xl: "1"}}} display="flex">
          <SimpleStatBox
            title={"Spiele gespielt"}
            value={playerGoalDataLine[0].data.length}
          />
        </Box>
        {/* Gesamt Tore ROW 2 */}
        <Box sx={{gridColumn: {
          xs: "3/5", sm: "3/5", md:"3/5", lg: "7/9", xl: "7/9"
        }, gridRow: {xs: "5", sm: "5", md:"5", lg:"2", xl: "2"}}} display="flex">
          <SimpleStatBox title={"Tore gesamt"} value={totalGoals} />
        </Box>
        {/* Durchschnitt Tore ROW 3 */}
        <Box sx={{gridColumn: {
          xs: "5/7", sm: "5/7", md:"5/7", lg: "7/9", xl: "7/9"
        }, gridRow: {xs: "5", sm: "5", md:"5", lg:"3", xl: "3"}}} display="flex">
          <SimpleStatBox
            title={"Tore Ø"}
            value={
              averageGoals % 1 === 0
                ? averageGoals.toString()
                : averageGoals.toFixed(2).replace(/\.?0+$/, "")
            }
          />
        </Box>
        {/* Siebenmeter Tore / Versuche ROW 4 */}
        <Fade in={isChecked} timeout={500}>
          <Box
            sx={{gridColumn: {
              xs: "1/3", sm: "1/3", md:"1/3", lg: "7/9", xl: "7/9"
            }, gridRow: {xs: "6", sm: "6", md:"6", lg:"4", xl: "4"}, 
              p: {
                xs: "0.25rem 0.125rem", 
                sm: "0.5rem 0.25rem", 
                md: "0.75rem 0.5rem", 
                lg: "1rem 0.75rem", 
                xl: "1.25rem 1rem",
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
                {penaltyPercentage % 1 === 0
                  ? penaltyPercentage.toString()
                  : penaltyPercentage.toFixed(2).replace(/\.?0+$/, "")}
                %
              </Typography>
            </Box>
          </Box>
        </Fade>
        {/* Technische Fehler ROW 5 */}
        <Box sx={{gridColumn: {
          xs: "3/5", sm: "3/5", md:"3/5", lg: "1/3", xl: "1/3"
        }, gridRow: {xs: "6", sm: "6", md:"6", lg:"5", xl: "5"}}} display="flex">
          <SimpleStatBox title={"Technische Fehler"} value={0} />{" "}
          {/*Coder für Technische Fehler einfügen */}
        </Box>
        {/* Gelbekarten ROW 5 COL 1/2 */}
        <Box sx={{gridColumn: {
          xs: "5/7", sm: "5/7", md:"5/7", lg: "3/5", xl: "3/5"
        }, gridRow: {xs: "6", sm: "6", md:"6", lg:"5", xl: "5"}}} display="flex">
          <SimpleStatBox
            title={"Gelbe Karten"}
            value={overallPlayerStatistics.yellowCards}
          />
        </Box>
        {/* Zeitstrafen ROW 5 COL 3/4 */}
        <Box sx={{gridColumn: {
          xs: "1/3", sm: "1/3", md:"1/3", lg: "5/7", xl: "5/7"
        }, gridRow: {xs: "7", sm: "7", md:"7", lg:"5", xl: "5"}}} display="flex">
          <SimpleStatBox
            title={"Zeitstrafen"}
            value={overallPlayerStatistics.penalties}
          />
        </Box>
        {/* Rote Karten ROW 5 COL 5/6 */}
        <Box sx={{gridColumn: {
          xs: "3/5", sm: "3/5", md:"3/5", lg: "7/9", xl: "7/9"
        }, gridRow: {xs: "7", sm: "7", md:"7", lg:"5", xl: "5"}}} display="flex">
          <SimpleStatBox
            title={"Rote Karten"}
            value={overallPlayerStatistics.redCards}
          />
        </Box>
        <Fade in={isChecked} timeout={500}>
          <Box

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
              gridColumn: {
                xs: "1/7", sm: "1/7", md:"1/7", lg: "1/9", xl: "1/9"
              }, gridRow: {xs: "8/14", sm: "8/14", md:"8/14", lg:"6/12", xl: "6/12"}
            }}
          >
            <Typography
              variant="h3"
              sx={{ color: theme.palette.secondary[100] }}
              textAlign="center"
              mb="20px"
            >
              Statistiken pro Spiel
            </Typography>
            <DataGrid
              rows={row || []}
              columns={isNonMediumScreens ?cols : columnsDataGridSmall}
              components={{ ColumnMenu: CustomColumnMenu }}
              localeText={{
                noRowsLabel: "Noch keine Daten verfügbar",
              }}
              onCellClick={handleCellClick}
            />
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};
export default PlayerDetailsCombined;
