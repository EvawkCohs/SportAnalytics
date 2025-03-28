import React, { useState } from "react";
import { H2HRadarChart } from "./RadarChart";
import { CustomInputLabel } from "components/CustomInputLabel";
import { CustomSelect } from "components/CustomSelect";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import {
  useTheme,
  Box,
  Typography,
  FormControl,
  Tooltip,
  MenuItem,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SimpleStatBox from "components/SimpleStatBox";
import { useGetGamesWithParticipationQuery } from "state/api";
import {
  GetLast5WinLose,
  GetTotalGoals,
  GetAverageGoalsLastFive,
  GetAverageGoalsConcededLastFive,
  GetTotalGoalsConceded,
  GetAveragePenaltyStats,
} from "./functions";
export const HeadToHeadComponent = ({ teamData }) => {
  const theme = useTheme();
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const [group, setGroup] = useState("SW");
  const [gender, setGender] = useState("male");
  const [teamId, setTeamId] = useState("");
  const [teamName, setTeamName] = useState("");
  const {
    data: teamGames,
    errorTeam,
    isLoadingTeam,
  } = useGetGamesWithParticipationQuery(teamId);
  const filteredTeams = (teamData || [])
    .filter((team) => team.group === group)
    .filter((team) => team.gender === gender)
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
  const dataLastFiveGamesTeam = teamGames
    ?.filter((game) => new Date(game.summary.startsAt).getTime() < Date.now())
    .sort((a, b) => new Date(b.summary.startsAt) - new Date(a.summary.startsAt))
    .slice(0, 5);
  const averageGoalsTeam = dataLastFiveGamesTeam
    ? GetTotalGoals(teamGames, teamId) /
      teamGames.filter((game) => game.summary.homeGoals > 0).length
    : 0;

  const averageGoalsLastFiveTeam = dataLastFiveGamesTeam
    ? GetAverageGoalsLastFive(dataLastFiveGamesTeam, teamId)
    : 0;
  const averageGoalsConcededTeam = teamGames
    ? GetTotalGoalsConceded(teamGames, teamId) /
      teamGames.filter((game) => game.summary.homeGoals > 0).length
    : 0;
  const averageGoalsConcededLastFiveTeam = dataLastFiveGamesTeam
    ? GetAverageGoalsConcededLastFive(dataLastFiveGamesTeam, teamId)
    : 0;

  const last5Team = GetLast5WinLose(dataLastFiveGamesTeam, teamId);
  const averagePenaltiesTeam = teamGames
    ? GetAveragePenaltyStats(teamGames, teamId) /
      teamGames.filter(
        (game) => new Date(game.summary.startsAt).getTime() < Date.now()
      ).length
    : 0;
  const dataRadarTeam = [
    {
      stat: " Tore",
      Team: averageGoalsTeam || 0,
    },
    {
      stat: " Gegentore",
      Team: averageGoalsConcededTeam || 0,
    },
    {
      stat: "Ø 7-Meter ",
      Team: (averagePenaltiesTeam * 5).toFixed(2) || 0,
    },
    { stat: "Zeitstrafen", Team: 0 },
  ];
  const handleMouseLeave = () => {
    setHoveredGroup(null);
  };
  const handleMouseEnter = (group) => {
    setHoveredGroup(group);
  };
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  const handleGroupChange = (event) => {
    setGroup(event.target.value);
  };
  const handleSelectionChange = (event) => {
    setTeamId(event.target.value);
    setTeamName(teamData.find((team) => team.id === event.target.value).name);
  };
  return (
    <Box
      flexDirection="column"
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      gap="1rem"
      mr="0.5rem"
    >
      <Typography variant="h2" sx={{ color: theme.palette.secondary[200] }}>
        {teamName ? teamName : "Team auswählen"}
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
        {teamId ? (
          <Box mr="2rem" gridColumn="1" height="60px">
            <img
              src={teamData.find((team) => team.id === teamId).logo}
              alt="team logo"
              width="50px"
            />
          </Box>
        ) : (
          <Box mr="2rem" gridColumn="1" height="60px" width="50px" />
        )}
        {/*Staffelauswahl */}
        <FormControl sx={{ minWidth: "200px", gridColumn: "1" }}>
          <CustomInputLabel id="Geschlechtauswahl">Geschlecht</CustomInputLabel>
          <CustomSelect
            value={gender}
            onChange={handleGenderChange}
            labelId={"Geschlechtauswahl"}
            label={"gender"}
          >
            <MenuItem value="male">Männer</MenuItem>
            <MenuItem value="female">Frauen</MenuItem>
          </CustomSelect>
        </FormControl>
        <FormControl sx={{ minWidth: "200px", gridColumn: "2" }}>
          <CustomInputLabel id="Staffelauswahl">Staffel</CustomInputLabel>
          <CustomSelect
            labelId="Staffelauswahl"
            value={group}
            label="Staffel"
            onChange={handleGroupChange}
          >
            {gender === "male"
              ? [
                  <MenuItem value="SW">3. Liga Staffel Süd-West</MenuItem>,
                  <MenuItem value="S">3. Liga Staffel Süd</MenuItem>,
                  <MenuItem value="NO">3. Liga Staffel Nord-Ost</MenuItem>,
                  <MenuItem value="NW">3. Liga Staffel Nord-West</MenuItem>,
                ]
              : [
                  <MenuItem value="N">3. Liga Staffel Nord</MenuItem>,
                  <MenuItem value="M">3. Liga Staffel Mitte</MenuItem>,
                  <MenuItem value="S">3. Liga Staffel Süd</MenuItem>,
                ]}
          </CustomSelect>
        </FormControl>
        {/*Teamauswahl */}
        <FormControl sx={{ minWidth: "300px", gridColumn: "3" }}>
          <CustomInputLabel id="Mannschaftsauswahl">
            Mannschaft
          </CustomInputLabel>
          <CustomSelect
            labelId={"Mannschaftsauswahl"}
            value={teamId}
            label="Mannschaft"
            onChange={handleSelectionChange}
          >
            {isLoadingTeam ? (
              <MenuItem disabled>Loading...</MenuItem> // Anzeige während des Ladens
            ) : (
              filteredTeams?.map(
                (
                  team // Sicherheitsabfrage, ob teamData existiert
                ) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                )
              )
            )}
          </CustomSelect>
        </FormControl>
      </Box>
      {/*Letzte 5 Spiele S/N/U */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        gap="1rem"
        mt="2rem"
        ml="1.5rem"
        width="100%"
        alignItems="center"
      >
        <Typography variant="h3" sx={{ color: theme.palette.secondary[200] }}>
          Letzten fünf Spiele:
        </Typography>
        {last5Team ? (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            gap="0.5rem"
          >
            {last5Team.map((game) =>
              game === "win" ? (
                <Box
                  sx={{ backgroundColor: theme.palette.green[100] }}
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
                  sx={{ backgroundColor: theme.palette.primary[600] }}
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
          width="250px"
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
            title={"Durchschnittliche Tore"}
            value={`Ø ${
              Number.isInteger(averageGoalsTeam)
                ? averageGoalsTeam
                : averageGoalsTeam.toFixed(2)
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
          backgroundColor={theme.palette.background.alt}
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
            {Number.isInteger(averageGoalsLastFiveTeam)
              ? averageGoalsLastFiveTeam
              : averageGoalsLastFiveTeam.toFixed(2)}
          </Typography>
          {averageGoalsLastFiveTeam >= averageGoalsTeam ? (
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              justifyContent="center"
              gap="0.5rem"
            >
              <TrendingUpIcon
                sx={{ color: theme.palette.green[100] }}
                fontSize="large"
              />
              <Typography
                variant="h4"
                sx={{ color: theme.palette.green[100] }}
                textAlign="center"
              >
                +{" "}
                {Number.isInteger(
                  (averageGoalsLastFiveTeam / averageGoalsTeam - 1) * 100
                )
                  ? (averageGoalsLastFiveTeam / averageGoalsTeam - 1) * 100
                  : (
                      (averageGoalsLastFiveTeam / averageGoalsTeam - 1) *
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
                  (1 - averageGoalsLastFiveTeam / averageGoalsTeam) * 100
                )
                  ? (1 - averageGoalsLastFiveTeam / averageGoalsTeam) * 100
                  : (
                      (1 - averageGoalsLastFiveTeam / averageGoalsTeam) *
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
              Number.isInteger(averageGoalsConcededTeam)
                ? averageGoalsConcededTeam
                : averageGoalsConcededTeam.toFixed(2)
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
          backgroundColor={theme.palette.background.alt}
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
            {Number.isInteger(averageGoalsConcededLastFiveTeam)
              ? averageGoalsConcededLastFiveTeam
              : averageGoalsConcededLastFiveTeam.toFixed(2)}
          </Typography>
          {averageGoalsConcededLastFiveTeam >= averageGoalsConcededTeam ? (
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
                  (averageGoalsConcededLastFiveTeam / averageGoalsConcededTeam -
                    1) *
                    100
                )
                  ? (averageGoalsConcededLastFiveTeam /
                      averageGoalsConcededTeam -
                      1) *
                    100
                  : (
                      (averageGoalsConcededLastFiveTeam /
                        averageGoalsConcededTeam -
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
              <TrendingDownIcon
                sx={{ color: theme.palette.green[100] }}
                fontSize="large"
              />
              <Typography
                variant="h4"
                sx={{ color: theme.palette.green[100] }}
                textAlign="center"
              >
                -{" "}
                {Number.isInteger(
                  (1 -
                    averageGoalsConcededLastFiveTeam /
                      averageGoalsConcededTeam) *
                    100
                )
                  ? (1 -
                      averageGoalsConcededLastFiveTeam /
                        averageGoalsConcededTeam) *
                    100
                  : (
                      (1 -
                        averageGoalsConcededLastFiveTeam /
                          averageGoalsConcededTeam) *
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
        height="40vh"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        width="70%"
      >
        <H2HRadarChart data={dataRadarTeam} />
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
  );
};
