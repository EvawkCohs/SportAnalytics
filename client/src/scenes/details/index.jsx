import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  const [tableData, setTableData] = useState([]);
  const [mostValuable, setMostValuable] = useState();
  const [goalDataHomeTeam, setGoalDataHomeTeam] = useState();
  const [goalDataAwayTeam, setGoalDataAwayTeam] = useState([]);
  const [row, setRow] = useState();
  const [missedShotsData, setMissedShotsData] = useState([]);

  //Profil
  const [profile, setProfile] = useState(null);
  const [errorProfile, setErrorProfile] = useState("");

  //Daten aus Nutzerdefinierten Stats
  const [userGameData, setUserGameData] = useState({
    userId: "",
    summary: {},
    lineup: {},
    events: [],
  });

  //LOGIN STATUS USE-EFFECT
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorProfile(
            `Sie sind derzeit nicht eingeloggt! Bitte loggen Sie sich ein, um das Profil zu sehen.`
          );
          return;
        }

        const apiUrl = process.env.API_URL || "http://localhost:5001";
        const response = await axios.get(`${apiUrl}/users/profile`, {
          headers: { Authorization: `bearer ${token}` },
        });

        setProfile(response.data);
      } catch (err) {
        setErrorProfile(
          "Fehler beim Abrufen des Profils: " + err.response?.data?.message ||
            err.message
        );
      }
    };

    fetchProfile();
  }, []); // Dieser Effekt wird nur beim ersten Rendern ausgeführt

  //NUTZERDEFINIERTE STATS EINLESEN USE-EFFECT
  useEffect(() => {
    if (!profile || !profile.username || !id || !gameData) return;

    const fetchGame = async (gameId, userId) => {
      try {
        const response = await axios.get(
          `http://localhost:5001/userGames/findUserGames`,
          { params: { gameId, userId } }
        );
        const specificGameData = response.data;
        // Überprüfung, ob die Antwort leer ist
        if (!specificGameData || Object.keys(specificGameData).length === 0) {
          throw new Error("Leere Antwort vom Server erhalten");
        }
        setUserGameData((prevData) => ({
          ...prevData,
          userId: profile.username,
          summary: specificGameData.summary,
          lineup: specificGameData.lineup,
          events: specificGameData.events,
        }));
        setEventData(specificGameData.events);
      } catch (err) {
        console.error(
          "Kein benutzerdefiniertes Spiel gefunden, verwende Handball.net",
          err
        );
        setUserGameData((prevData) => ({
          ...prevData,
          summary: gameData.summary,
          lineup: gameData.lineup,
          events: gameData.events,
        }));
        setEventData(gameData.events);
      }
    };

    fetchGame(id, profile.username);
  }, [profile, gameData, id]); // Der Effekt wird erneut ausgeführt, wenn sich `profile` oder `id` ändert
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
    //Fehlwurf Daten
    setMissedShotsData(
      FormatSpecificEventData({ data: dataSource }, "missedShot")
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

  //HANDLER
  //Navigation zur Analysepage
  const handleAnalyseButton = () => {
    navigate(`/videoanalyse/${id}`);
  };
  //Navigation zu Spielerdetails
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

  //Ladeanzeige/Fehlerhandling
  if (data.isLoading || !goalDataAwayTeam || !goalDataHomeTeam) {
    return <div>Loading....</div>; // Später noch Ladekreis einbauen oder etwas vergleichbares
  }

  return (
    <div id="content">
      <Box m="1.5rem  2.5rem">
        <FlexBetween>
          <Header
            title="GAME DETAILS"
            subtitle={`${gameData.summary.homeTeam.name} vs ${gameData.summary.awayTeam.name}`}
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
            />
          </Box>
          <Box gridColumn="7/9" gridRow="span 1">
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
          {/*Box 3rd Column */}
          <PieChart data={technicalFoulsData} title={"Technische Fehler"} />
          {/*Box 4th Column */}
          <PieChart data={sevenMeterData} title={"Siebenmetertore"} />
          {/*Box 5th column */}
          <PieChart
            data={goalDataHomeTeam}
            title={`Tore nach Positionen ${gameData.summary.homeTeam.name}`}
          />
          {/*Box 6th column */}
          {
            <PieChart
              data={goalDataAwayTeam}
              title={`Tore nach Positionen ${gameData.summary.awayTeam.name}`}
            />
          }
          {/*Box 7th column */}
          <PieChart data={missedShotsData} title={`Fehlwürfe`} />
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
