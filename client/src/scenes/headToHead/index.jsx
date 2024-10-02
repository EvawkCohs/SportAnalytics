import { FormControl, Tooltip, Typography, useTheme } from "@mui/material";
import Header from "components/Header";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetGamesWithParticipationQuery,
  useGetTeamModelQuery,
} from "state/api";
import { Box, MenuItem, Select, InputLabel, Divider } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SimpleStatBox from "components/SimpleStatBox";
import {
  GetLast5WinLose,
  GetTotalGoals,
  GetAverageGoalsLastFive,
  GetAverageGoalsConcededLastFive,
  GetTotalGoalsConceded,
  GetAveragePenaltyStats,
} from "./functions";
import { ResponsiveRadar } from "@nivo/radar";
const MyResponsiveRadar = ({ data }) => {
  const theme = useTheme();
  return (
    <ResponsiveRadar
      data={data || []}
      keys={["Team"]}
      indexBy="stat"
      margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
      borderColor={theme.palette.red[400]}
      gridLabelOffset={36}
      gridShape="linear"
      dotSize={10}
      dotColor={theme.palette.red[400]}
      dotBorderWidth={2}
      colors={theme.palette.red[400]}
      blendMode="multiply"
      maxValue={40}
      theme={{
        grid: {
          line: {
            stroke: theme.palette.grey[600],
          },
        },
        text: { fill: theme.palette.secondary[200] },
        tooltip: {
          container: {
            background: theme.palette.grey[700],
            color: theme.palette.secondary[200],
          },
        },
      }}
    />
  );
};
const HeadToHead = () => {
  const theme = useTheme();
  const { data: teamData, isLoading } = useGetTeamModelQuery();

  //TEAM A
  const [teamAId, setTeamAId] = useState("");
  const [teamAName, setTeamAName] = useState("");
  const [groupA, setGroupA] = useState("SW");
  const {
    data: teamAGames,
    errorTeamA,
    isLoadingTeamA,
  } = useGetGamesWithParticipationQuery(teamAId);
  //TEAM B
  const [teamBId, setTeamBId] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [groupB, setGroupB] = useState("SW");
  const {
    data: teamBGames,
    errorTeamB,
    isLoadingTeamB,
  } = useGetGamesWithParticipationQuery(teamBId);

  //TEAM A STATS
  const dataLastFiveGamesTeamA = teamAGames
    ?.filter((game) => new Date(game.summary.startsAt).getTime() < Date.now())
    .sort((a, b) => new Date(b.summary.startsAt) - new Date(a.summary.startsAt))
    .slice(0, 5);

  const last5TeamA = GetLast5WinLose(dataLastFiveGamesTeamA, teamAId);

  const averageGoalsTeamA = dataLastFiveGamesTeamA
    ? GetTotalGoals(teamAGames, teamAId) /
      teamAGames.filter((game) => game.summary.homeGoals > 0).length
    : 0;

  const averageGoalsLastFiveTeamA = dataLastFiveGamesTeamA
    ? GetAverageGoalsLastFive(dataLastFiveGamesTeamA, teamAId)
    : 0;
  const averageGoalsConcededTeamA = teamAGames
    ? GetTotalGoalsConceded(teamAGames, teamAId) /
      teamAGames.filter((game) => game.summary.homeGoals > 0).length
    : 0;
  const averageGoalsConcededLastFiveTeamA = dataLastFiveGamesTeamA
    ? GetAverageGoalsConcededLastFive(dataLastFiveGamesTeamA, teamAId)
    : 0;
  const handleGroupChangeA = (event) => {
    setGroupA(event.target.value);
  };
  const filteredTeamsA = (teamData || [])
    .filter((team) => team.group === groupA)
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  const HandleSelectionChangeA = (event) => {
    setTeamAId(event.target.value);
    setTeamAName(teamData.find((team) => team.id === event.target.value).name);
  };
  //TEAM B STATS
  const dataLastFiveGamesTeamB = teamBGames
    ?.filter((game) => new Date(game.summary.startsAt).getTime() < Date.now())
    .sort((a, b) => new Date(b.summary.startsAt) - new Date(a.summary.startsAt))
    .slice(0, 5);

  const last5TeamB = teamBGames
    ? GetLast5WinLose(dataLastFiveGamesTeamB, teamBId)
    : [];

  const averageGoalsTeamB = teamBGames
    ? GetTotalGoals(teamBGames, teamBId) /
      teamBGames.filter((game) => game.summary.homeGoals > 0).length
    : 0;
  const averageGoalsLastFiveTeamB = dataLastFiveGamesTeamB
    ? GetAverageGoalsLastFive(dataLastFiveGamesTeamB, teamBId)
    : 0;
  const averageGoalsConcededTeamB = teamBGames
    ? GetTotalGoalsConceded(teamBGames, teamBId) /
      teamBGames.filter((game) => game.summary.homeGoals > 0).length
    : 0;
  const averageGoalsConcededLastFiveTeamB = dataLastFiveGamesTeamB
    ? GetAverageGoalsConcededLastFive(dataLastFiveGamesTeamB, teamBId)
    : 0;
  const filteredTeamsB = (teamData || [])
    .filter((team) => team.group === groupB)
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  const averagePenaltiesTeamA = teamAGames
    ? GetAveragePenaltyStats(teamAGames, teamAId) /
      teamAGames.filter(
        (game) => new Date(game.summary.startsAt).getTime() < Date.now()
      ).length
    : 0;
  const averagePenaltiesTeamB = teamBGames
    ? GetAveragePenaltyStats(teamBGames, teamBId) /
      teamBGames.filter(
        (game) => new Date(game.summary.startsAt).getTime() < Date.now()
      ).length
    : 0;
  const dataRadarTeamA = [
    {
      stat: " Tore",
      Team: averageGoalsTeamA || 0,
    },
    {
      stat: " Gegentore",
      Team: averageGoalsConcededTeamA || 0,
    },
    {
      stat: "Ø 7-Meter ",
      Team: averagePenaltiesTeamA * 5 || 0,
    },
    { stat: "Zeitstrafen", Team: 0 },
  ];
  const dataRadarTeamB = [
    {
      stat: " Tore",
      Team: averageGoalsTeamB || 0,
    },
    {
      stat: " Gegentore",
      Team: averageGoalsConcededTeamB || 0,
    },
    {
      stat: "Ø 7-Meter ",
      Team: averagePenaltiesTeamB * 5 || 0,
    },
    { stat: "Zeitstrafen", Team: 0 },
  ];

  //Handler
  const handleGroupChangeB = (event) => {
    setGroupB(event.target.value);
  };
  const HandleSelectionChangeB = (event) => {
    setTeamBId(event.target.value);
    setTeamBName(teamData.find((team) => team.id === event.target.value).name);
  };

  const [hoveredGroup, setHoveredGroup] = useState(null);
  // Funktion zum Handling des Hover-Starts
  const handleMouseEnter = (group) => {
    setHoveredGroup(group);
  };

  // Funktion zum Handling des Hover-Endes
  const handleMouseLeave = () => {
    setHoveredGroup(null);
  };
  if (
    isLoading ||
    !dataLastFiveGamesTeamA ||
    isLoadingTeamA ||
    isLoadingTeamB
  ) {
    return <div>Loading...</div>;
  }
  if (errorTeamA || errorTeamB) {
    return <div>ERROR</div>;
  }
  return (
    <Box m="1.5rem 1.5rem">
      <Header title="HEAD TO HEAD" subtitle={`${teamAName} vs ${teamBName}`} />
      {/*Flexbox gesamter Inhalt */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-evenly"
        alignItems="flex-start"
        mt="2rem"
      >
        {/*Flexbox TeamA */}
        <Box
          flexDirection="column"
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          gap="1rem"
          mr="0.5rem"
        >
          <Typography variant="h2" sx={{ color: theme.palette.secondary[200] }}>
            {teamAName ? teamAName : "Team A auswählen"}
          </Typography>
          {/*Flexbox Staffel und Teamauswahl */}
          <Box
            display="grid"
            gridTemplateColumns="auto(4)"
            justifyItems="center"
            alignItems="center"
            gap="1rem"
          >
            {/*Logo */}
            {teamAId ? (
              <Box mr="2rem" gridColumn="1" height="60px">
                <img
                  src={teamData.find((team) => team.id === teamAId).logo}
                  width="50px"
                  alt={""}
                />
              </Box>
            ) : (
              <Box mr="2rem" gridColumn="1" width="50px" height="60px" />
            )}
            {/*Staffelauswahl */}
            <FormControl sx={{ minWidth: "200px", gridColumn: "2" }}>
              <InputLabel
                id="Staffelauswahl"
                sx={{
                  "&.Mui-focused": {
                    color: theme.palette.secondary[300],
                  },
                  color: theme.palette.secondary[200],
                }}
              >
                Staffel
              </InputLabel>
              <Select
                value={groupA}
                onChange={handleGroupChangeA}
                label="group"
                sx={{
                  "&.MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: theme.palette.secondary[200], // Standardborderfarbe
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.secondary[500], // Farbe beim Hovern
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.secondary[500], // Farbe beim Fokussieren
                    },
                  },
                  "& .MuiSelect-select": {
                    color: theme.palette.secondary[200],
                  },
                  "& .MuiSelect-select.MuiSelect-select": {
                    color: theme.palette.secondary[200],
                  },
                }}
              >
                <MenuItem value="SW">3. Liga Staffel Süd-West</MenuItem>
                <MenuItem value="S">3. Liga Staffel Süd</MenuItem>
                <MenuItem value="NO">3. Liga Staffel Nord-Ost</MenuItem>
                <MenuItem value="NW">3. Liga Staffel Nord-West</MenuItem>
              </Select>
            </FormControl>
            {/*Teamauswahl */}
            <FormControl sx={{ minWidth: "300px", gridColumn: "3" }}>
              <InputLabel
                id="Mannschaftsauswahl"
                sx={{
                  "&.Mui-focused": {
                    color: theme.palette.secondary[300],
                  },
                  color: theme.palette.secondary[200],
                }}
              >
                Mannschaft
              </InputLabel>
              <Select
                value={teamAId}
                label="mannschaft"
                onChange={HandleSelectionChangeA}
                variant="outlined"
                sx={{
                  "&.MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: theme.palette.secondary[200], // Standardborderfarbe
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.secondary[500], // Farbe beim Hovern
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.secondary[500], // Farbe beim Fokussieren
                    },
                  },
                  "& .MuiSelect-select": {
                    color: theme.palette.secondary[200],
                  },
                  "& .MuiSelect-select.MuiSelect-select": {
                    color: theme.palette.secondary[200],
                  },
                }}
              >
                {isLoading ? (
                  <MenuItem disabled>Loading...</MenuItem> // Anzeige während des Ladens
                ) : (
                  filteredTeamsA?.map(
                    (
                      team // Sicherheitsabfrage, ob teamData existiert
                    ) => (
                      <MenuItem key={team.id} value={team.id}>
                        {team.name}
                      </MenuItem>
                    )
                  )
                )}
              </Select>
            </FormControl>
          </Box>
          {/*Letzte 5 Spiele S/N/U */}
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            gap="1rem"
            mt="2rem"
            ml="2rem"
            width="100%"
            alignItems="center"
          >
            <Typography
              variant="h3"
              sx={{ color: theme.palette.secondary[200] }}
            >
              Letzten fünf Spiele:
            </Typography>

            {last5TeamA ? (
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                gap="0.5rem"
              >
                {last5TeamA.map((game) =>
                  game === "win" ? (
                    <Box
                      sx={{ backgroundColor: "green" }}
                      borderRadius="0.25rem"
                    >
                      <Typography
                        variant="h3"
                        sx={{ color: "white" }}
                        m="0 0.25rem"
                      >
                        W
                      </Typography>
                    </Box>
                  ) : game === "tie" ? (
                    <Box
                      sx={{ backgroundColor: theme.palette.grey[600] }}
                      borderRadius="0.25rem"
                    >
                      <Typography
                        variant="h3"
                        sx={{ color: "white" }}
                        m="0 0.25rem"
                      >
                        U
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{ backgroundColor: theme.palette.red[600] }}
                      borderRadius="0.25rem"
                    >
                      <Typography
                        variant="h3"
                        sx={{ color: "white" }}
                        m="0 0.25rem"
                      >
                        L
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            ) : (
              <div>Loading...</div>
            )}
            <Tooltip
              title={
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  aktuellstes Spiel zuerst gelistet
                </Typography>
              }
            >
              <InfoOutlinedIcon
                fontSize="medium"
                sx={{ color: theme.palette.secondary[200] }}
              />
            </Tooltip>
          </Box>
          {/*Basic Statistiken */}
          <Box
            display="flex"
            flexDirection="row"
            justifyItems="flex-start"
            alignItems="center"
            flexWrap="wrap"
          >
            {/*Tore gesamte Saison */}
            <Box
              display="flex"
              m="0.5rem"
              height="250px"
              className="AverageGoals"
              borderRadius="0.55rem"
              width="260px"
              sx={{
                border:
                  hoveredGroup === "AverageGoals"
                    ? `2px solid ${theme.palette.secondary[400]}`
                    : null,
                boxShadow:
                  hoveredGroup === "AverageGoals"
                    ? `0 0 5px ${theme.palette.secondary[500]}`
                    : null,
              }}
              onMouseEnter={() => handleMouseEnter("AverageGoals")}
              onMouseLeave={handleMouseLeave}
            >
              <SimpleStatBox
                title={"Durschnittliche Tore"}
                value={`Ø ${
                  Number.isInteger(averageGoalsTeamA)
                    ? averageGoalsTeamA
                    : averageGoalsTeamA.toFixed(2)
                }`}
                secondaryValue={"in dieser Saison"}
              />
            </Box>
            {/*Tore letzte 5 Spiele */}

            <Box
              display="flex"
              m="0.5rem "
              flexDirection="column"
              justifyContent="flex-start"
              backgroundColor={theme.palette.primary[700]}
              borderRadius="0.55rem"
              p="1.25rem 1rem"
              className="data-display"
              width="250px"
              height="250px"
              sx={{
                border:
                  hoveredGroup === "AverageGoalsLast5"
                    ? `2px solid ${theme.palette.secondary[400]}`
                    : null,
                boxShadow:
                  hoveredGroup === "AverageGoalsLast5"
                    ? `0 0 5px ${theme.palette.secondary[500]}`
                    : null,
              }}
              onMouseEnter={() => handleMouseEnter("AverageGoalsLast5")}
              onMouseLeave={handleMouseLeave}
            >
              <Typography
                sx={{ color: theme.palette.secondary[200], fontSize: 28 }}
                textAlign="center"
                mb="1.5rem"
              >
                Durchschnittliche Tore
              </Typography>
              <Typography
                variant="h2"
                sx={{ color: theme.palette.secondary[200] }}
                textAlign="center"
                mb="0.25rem"
              >
                Ø{" "}
                {Number.isInteger(averageGoalsLastFiveTeamA)
                  ? averageGoalsLastFiveTeamA
                  : averageGoalsLastFiveTeamA.toFixed(2)}
              </Typography>
              {averageGoalsLastFiveTeamA >= averageGoalsTeamA ? (
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
                      (averageGoalsLastFiveTeamA / averageGoalsTeamA - 1) * 100
                    )
                      ? (averageGoalsLastFiveTeamA / averageGoalsTeamA - 1) *
                        100
                      : (
                          (averageGoalsLastFiveTeamA / averageGoalsTeamA - 1) *
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
                      (1 - averageGoalsLastFiveTeamA / averageGoalsTeamA) * 100
                    )
                      ? (1 - averageGoalsLastFiveTeamA / averageGoalsTeamA) *
                        100
                      : (
                          (1 - averageGoalsLastFiveTeamA / averageGoalsTeamA) *
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
                mt="0.25rem"
              >
                in den letzten 5 Spielen
              </Typography>
            </Box>
            {/*Gegentore gesamte Saison */}
            <Box
              display="flex"
              m="0.5rem"
              height="250px"
              width="250px"
              borderRadius="0.55rem"
              sx={{
                border:
                  hoveredGroup === "AverageConceded"
                    ? `2px solid ${theme.palette.secondary[400]}`
                    : null,
                boxShadow:
                  hoveredGroup === "AverageConceded"
                    ? `0 0 5px ${theme.palette.secondary[500]}`
                    : null,
              }}
              onMouseEnter={() => handleMouseEnter("AverageConceded")}
              onMouseLeave={handleMouseLeave}
            >
              <SimpleStatBox
                title={"Gegentore gesamt"}
                value={`Ø ${
                  Number.isInteger(averageGoalsConcededTeamA)
                    ? averageGoalsConcededTeamA
                    : averageGoalsConcededTeamA.toFixed(2)
                }`}
                secondaryValue={"in dieser Saison"}
              />
            </Box>
            {/* Gegentore letzte 5 Spiele */}
            <Box
              display="flex"
              m="0.5rem "
              height="250px"
              flexDirection="column"
              width="250px"
              justifyContent="flex-start"
              backgroundColor={theme.palette.primary[700]}
              borderRadius="0.55rem"
              p="1.25rem 1rem"
              className="data-display"
              sx={{
                border:
                  hoveredGroup === "AverageConcededLast5"
                    ? `2px solid ${theme.palette.secondary[400]}`
                    : null,
                boxShadow:
                  hoveredGroup === "AverageConcededLast5"
                    ? `0 0 5px ${theme.palette.secondary[500]}`
                    : null,
              }}
              onMouseEnter={() => handleMouseEnter("AverageConcededLast5")}
              onMouseLeave={handleMouseLeave}
            >
              <Typography
                sx={{ color: theme.palette.secondary[200], fontSize: 28 }}
                textAlign="center"
                mb="1.5rem"
              >
                Durchschnittliche Gegentore
              </Typography>
              <Typography
                variant="h2"
                sx={{ color: theme.palette.secondary[200] }}
                textAlign="center"
                mb="0.25rem"
              >
                Ø{" "}
                {Number.isInteger(averageGoalsConcededLastFiveTeamA)
                  ? averageGoalsConcededLastFiveTeamA
                  : averageGoalsConcededLastFiveTeamA.toFixed(2)}
              </Typography>
              {averageGoalsConcededLastFiveTeamA >=
              averageGoalsConcededTeamA ? (
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
                      (averageGoalsConcededLastFiveTeamA /
                        averageGoalsConcededTeamA -
                        1) *
                        100
                    )
                      ? (averageGoalsConcededLastFiveTeamA /
                          averageGoalsConcededTeamA -
                          1) *
                        100
                      : (
                          (averageGoalsConcededLastFiveTeamA /
                            averageGoalsConcededTeamA -
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
                      (1 -
                        averageGoalsConcededLastFiveTeamA /
                          averageGoalsConcededTeamA) *
                        100
                    )
                      ? (1 -
                          averageGoalsConcededLastFiveTeamA /
                            averageGoalsConcededTeamA) *
                        100
                      : (
                          (1 -
                            averageGoalsConcededLastFiveTeamA /
                              averageGoalsConcededTeamA) *
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
                mt="0.25rem"
              >
                in den letzten 5 Spielen
              </Typography>
            </Box>
          </Box>
          {/*Radar Chart */}
          <Box
            height="45vh"
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            width="70%"
          >
            <MyResponsiveRadar data={dataRadarTeamA} />
            <Tooltip
              title={
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  Durchschnittswerte aus den Spielen (7m-Wert mit Faktor 5
                  multipliziert)
                </Typography>
              }
            >
              <InfoOutlinedIcon
                fontSize="medium"
                sx={{
                  color: theme.palette.secondary[200],
                  mr: "2rem",
                }}
              />
            </Tooltip>
          </Box>
        </Box>

        {/*Divider */}
        <Divider orientation="vertical" flexItem textAlign="center">
          VS
        </Divider>
        {/*Flexbox TeamB */}
        <Box
          flexDirection="column"
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          gap="1rem"
          width="50%"
        >
          <Typography variant="h2" sx={{ color: theme.palette.secondary[200] }}>
            {teamBName ? teamBName : "Team B auswählen"}
          </Typography>
          {/*Flexbox Staffel und Teamauswahl */}
          <Box
            display="grid"
            gridTemplateColumns="auto(4)"
            justifyItems="center"
            alignItems="center"
            gap="1rem"
          >
            {/*Logo */}
            {teamBId ? (
              <Box mr="2rem" gridColumn="1" height="60px">
                <img
                  src={teamData.find((team) => team.id === teamBId).logo}
                  width="50px"
                  alt={""}
                />
              </Box>
            ) : (
              <Box mr="2rem" gridColumn="1" width="50px" height="60px" />
            )}
            {/*Staffelauswahl */}
            <FormControl sx={{ minWidth: "200px", gridColumn: "2" }}>
              <InputLabel
                id="Staffelauswahl"
                sx={{
                  "&.Mui-focused": {
                    color: theme.palette.secondary[300],
                  },
                  color: theme.palette.secondary[200],
                }}
              >
                Staffel
              </InputLabel>
              <Select
                value={groupB}
                onChange={handleGroupChangeB}
                label="group"
                sx={{
                  "&.MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: theme.palette.secondary[200], // Standardborderfarbe
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.secondary[500], // Farbe beim Hovern
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.secondary[500], // Farbe beim Fokussieren
                    },
                  },
                  "& .MuiSelect-select": {
                    color: theme.palette.secondary[200],
                  },
                  "& .MuiSelect-select.MuiSelect-select": {
                    color: theme.palette.secondary[200],
                  },
                }}
              >
                <MenuItem value="SW">3. Liga Staffel Süd-West</MenuItem>
                <MenuItem value="S">3. Liga Staffel Süd</MenuItem>
                <MenuItem value="NO">3. Liga Staffel Nord-Ost</MenuItem>
                <MenuItem value="NW">3. Liga Staffel Nord-West</MenuItem>
              </Select>
            </FormControl>
            {/*Teamauswahl */}
            <FormControl sx={{ minWidth: "300px", gridColumn: "3" }}>
              <InputLabel
                id="Mannschaftsauswahl"
                sx={{
                  "&.Mui-focused": {
                    color: theme.palette.secondary[300],
                  },
                  color: theme.palette.secondary[200],
                }}
              >
                Mannschaft
              </InputLabel>
              <Select
                value={teamBId}
                label="mannschaft"
                onChange={HandleSelectionChangeB}
                variant="outlined"
                sx={{
                  "&.MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: theme.palette.secondary[200], // Standardborderfarbe
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.secondary[500], // Farbe beim Hovern
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.secondary[500], // Farbe beim Fokussieren
                    },
                  },
                  "& .MuiSelect-select": {
                    color: theme.palette.secondary[200],
                  },
                  "& .MuiSelect-select.MuiSelect-select": {
                    color: theme.palette.secondary[200],
                  },
                }}
              >
                {isLoading ? (
                  <MenuItem disabled>Loading...</MenuItem> // Anzeige während des Ladens
                ) : (
                  filteredTeamsB?.map(
                    (
                      team // Sicherheitsabfrage, ob teamData existiert
                    ) => (
                      <MenuItem key={team.id} value={team.id}>
                        {team.name}
                      </MenuItem>
                    )
                  )
                )}
              </Select>
            </FormControl>
          </Box>

          {/*Letzte 5 Spiele Win/lose */}
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            gap="1rem"
            mt="2rem"
            width="100%"
          >
            <Typography
              variant="h3"
              sx={{ color: theme.palette.secondary[200] }}
            >
              Letzten fünf Spiele:
            </Typography>
            {last5TeamB ? (
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                gap="0.5rem"
              >
                {last5TeamB.map((game) =>
                  game === "win" ? (
                    <Box
                      sx={{ backgroundColor: "green" }}
                      borderRadius="0.25rem"
                    >
                      <Typography
                        variant="h3"
                        sx={{ color: "white" }}
                        m="0 0.25rem"
                      >
                        W
                      </Typography>
                    </Box>
                  ) : game === "tie" ? (
                    <Box
                      sx={{ backgroundColor: theme.palette.grey[600] }}
                      borderRadius="0.25rem"
                    >
                      <Typography
                        variant="h3"
                        sx={{ color: "white" }}
                        m="0 0.25rem"
                      >
                        U
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{ backgroundColor: theme.palette.red[600] }}
                      borderRadius="0.25rem"
                    >
                      <Typography
                        variant="h3"
                        sx={{ color: "white" }}
                        m="0 0.25rem"
                      >
                        L
                      </Typography>
                    </Box>
                  )
                )}
                <Tooltip
                  title={
                    <Typography
                      variant="h6"
                      sx={{ color: theme.palette.secondary[200] }}
                    >
                      aktuellstes Spiel zuerst gelistet
                    </Typography>
                  }
                >
                  <InfoOutlinedIcon
                    fontSize="medium"
                    sx={{ color: theme.palette.secondary[200] }}
                  />
                </Tooltip>
              </Box>
            ) : (
              <div>Loading...</div>
            )}
          </Box>
          {/*Basic Statistiken */}
          <Box
            display="flex"
            flexDirection="row"
            justifyItems="flex-start"
            alignItems="center"
            flexWrap="wrap"
          >
            {/*Tore gesamte Saison */}
            <Box
              gridColumn="1"
              display="flex"
              m="0.5rem"
              height="250px"
              width="250px"
              className="AverageGoals"
              borderRadius="0.55rem"
              sx={{
                border:
                  hoveredGroup === "AverageGoals"
                    ? `2px solid ${theme.palette.secondary[400]}`
                    : null,
                boxShadow:
                  hoveredGroup === "AverageGoals"
                    ? `0 0 5px ${theme.palette.secondary[500]}`
                    : null,
              }}
              onMouseEnter={() => handleMouseEnter("AverageGoals")}
              onMouseLeave={handleMouseLeave}
            >
              <SimpleStatBox
                title={"Durschnittliche Tore"}
                value={`Ø ${
                  Number.isInteger(averageGoalsTeamB)
                    ? averageGoalsTeamB
                    : averageGoalsTeamB.toFixed(2)
                }`}
                secondaryValue={"in dieser Saison"}
              />
            </Box>
            {/*Tore letzte 5 Spiele */}

            <Box
              gridColumn="2"
              display="flex"
              m="0.5rem "
              flexDirection="column"
              justifyContent="flex-start"
              backgroundColor={theme.palette.primary[700]}
              borderRadius="0.55rem"
              p="1.25rem 1rem"
              className="data-display"
              height="250px"
              width="250px"
              sx={{
                border:
                  hoveredGroup === "AverageGoalsLast5"
                    ? `2px solid ${theme.palette.secondary[400]}`
                    : null,
                boxShadow:
                  hoveredGroup === "AverageGoalsLast5"
                    ? `0 0 5px ${theme.palette.secondary[500]}`
                    : null,
              }}
              onMouseEnter={() => handleMouseEnter("AverageGoalsLast5")}
              onMouseLeave={handleMouseLeave}
            >
              <Typography
                variant="h2"
                sx={{ color: theme.palette.secondary[200] }}
                textAlign="center"
                mb="2rem"
              >
                Durchschnittliche Tore
              </Typography>
              <Typography
                variant="h2"
                sx={{ color: theme.palette.secondary[200] }}
                textAlign="center"
                mb="0.25rem"
              >
                Ø{" "}
                {Number.isInteger(averageGoalsLastFiveTeamB)
                  ? averageGoalsLastFiveTeamB
                  : averageGoalsLastFiveTeamB.toFixed(2)}
              </Typography>
              {averageGoalsLastFiveTeamB >= averageGoalsTeamB ? (
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
                      (averageGoalsLastFiveTeamB / averageGoalsTeamB - 1) * 100
                    )
                      ? (averageGoalsLastFiveTeamB / averageGoalsTeamB - 1) *
                        100
                      : (
                          (averageGoalsLastFiveTeamB / averageGoalsTeamB - 1) *
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
                      (1 - averageGoalsLastFiveTeamB / averageGoalsTeamB) * 100
                    )
                      ? (1 - averageGoalsLastFiveTeamB / averageGoalsTeamB) *
                        100
                      : (
                          (1 - averageGoalsLastFiveTeamB / averageGoalsTeamB) *
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
                mt="0.25rem"
              >
                in den letzten 5 Spielen
              </Typography>
            </Box>
            {/*Gegentore gesamte Saison */}
            <Box
              display="flex"
              gridColumn="3"
              m="0.5rem"
              height="250px"
              width="250px"
              borderRadius="0.55rem"
              sx={{
                border:
                  hoveredGroup === "AverageConceded"
                    ? `2px solid ${theme.palette.secondary[400]}`
                    : null,
                boxShadow:
                  hoveredGroup === "AverageConceded"
                    ? `0 0 5px ${theme.palette.secondary[500]}`
                    : null,
              }}
              onMouseEnter={() => handleMouseEnter("AverageConceded")}
              onMouseLeave={handleMouseLeave}
            >
              <SimpleStatBox
                title={"Gegentore gesamt"}
                value={`Ø ${
                  Number.isInteger(averageGoalsConcededTeamB)
                    ? averageGoalsConcededTeamB
                    : averageGoalsConcededTeamB.toFixed(2)
                }`}
                secondaryValue={"in dieser Saison"}
              />
            </Box>
            {/* Gegentore letzte 5 Spiele */}
            <Box
              gridColumn="4"
              display="flex"
              height="250px"
              width="250px"
              m="0.5rem"
              flexDirection="column"
              justifyContent="flex-start"
              backgroundColor={theme.palette.primary[700]}
              borderRadius="0.55rem"
              p="1.25rem 1rem"
              className="data-display"
              sx={{
                border:
                  hoveredGroup === "AverageConcededLast5"
                    ? `2px solid ${theme.palette.secondary[400]}`
                    : null,
                boxShadow:
                  hoveredGroup === "AverageConcededLast5"
                    ? `0 0 5px ${theme.palette.secondary[500]}`
                    : null,
              }}
              onMouseEnter={() => handleMouseEnter("AverageConcededLast5")}
              onMouseLeave={handleMouseLeave}
            >
              <Typography
                sx={{ color: theme.palette.secondary[200], fontSize: 28 }}
                textAlign="center"
                mb="1.5rem"
              >
                Durchschnittliche Gegentore
              </Typography>
              <Typography
                variant="h2"
                sx={{ color: theme.palette.secondary[200] }}
                textAlign="center"
                mb="0.25rem"
              >
                Ø{" "}
                {Number.isInteger(averageGoalsConcededLastFiveTeamB)
                  ? averageGoalsConcededLastFiveTeamB
                  : averageGoalsConcededLastFiveTeamB.toFixed(2)}
              </Typography>
              {averageGoalsConcededLastFiveTeamB >=
              averageGoalsConcededTeamB ? (
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
                      (averageGoalsConcededLastFiveTeamB /
                        averageGoalsConcededTeamB -
                        1) *
                        100
                    )
                      ? (averageGoalsConcededLastFiveTeamB /
                          averageGoalsConcededTeamB -
                          1) *
                        100
                      : (
                          (averageGoalsConcededLastFiveTeamB /
                            averageGoalsConcededTeamB -
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
                      (1 -
                        averageGoalsConcededLastFiveTeamB /
                          averageGoalsConcededTeamB) *
                        100
                    )
                      ? (1 -
                          averageGoalsConcededLastFiveTeamB /
                            averageGoalsConcededTeamB) *
                        100
                      : (
                          (1 -
                            averageGoalsConcededLastFiveTeamB /
                              averageGoalsConcededTeamB) *
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
                mt="0.25rem"
              >
                in den letzten 5 Spielen
              </Typography>
            </Box>
          </Box>
          {/*Radar Chart */}
          <Box
            height="45vh"
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            width="70%"
          >
            <MyResponsiveRadar data={dataRadarTeamB} />

            <Tooltip
              title={
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  Durchschnittswerte aus den Spielen (7m-Wert mit Faktor 5
                  multipliziert)
                </Typography>
              }
            >
              <InfoOutlinedIcon
                fontSize="medium"
                sx={{
                  color: theme.palette.secondary[200],
                  mr: "2rem",
                }}
              />
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default HeadToHead;
