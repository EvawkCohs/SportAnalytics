import { useTheme } from "@emotion/react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetGamesWithParticipationQuery,
  useGetTeamModelQuery,
} from "state/api";
import { GetOverallLineupData } from "./dataFormat";
import Header from "components/Header";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

const Player = ({
  id,
  firstname,
  lastname,
  position,
  number,
  gamesPlayed,
  goals,
  mostGoals,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
        width: "350px",
        height: "250px",
        transition: `transform 0.6s ease`,
        ":hover": {
          cursor: "pointer",
          backgroundColor: theme.palette.grey[600],
          transform: `scale(1.1)`,
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "column",
        }}
      >
        <Box display="flex" justifyContent="flex-start" flexDirection="column">
          <Box
            display="flex"
            justifyContent="space-between"
            flexDirection="row"
            gap="50px"
            alignItems="center"
            mb="20px"
          >
            <Box
              display="flex"
              justifyContent="flex-start"
              flexDirection="column"
            >
              <Typography
                sx={{ fontSize: "20px", color: theme.palette.secondary[200] }}
              >
                {lastname}
              </Typography>
              <Typography
                sx={{ fontSize: "16px", color: theme.palette.secondary[200] }}
              >
                {firstname}
              </Typography>
            </Box>
            <Typography
              sx={{ fontSize: "40px", color: theme.palette.secondary[200] }}
            >{`# ${number}`}</Typography>
          </Box>
          <Typography
            sx={{ fontSize: "12px", color: theme.palette.secondary[200] }}
          >{`Position: ${position}`}</Typography>
          <Typography
            sx={{ fontSize: "12px", color: theme.palette.secondary[200] }}
          >{`Spiele: ${gamesPlayed}`}</Typography>
          <Typography
            sx={{ fontSize: "12px", color: theme.palette.secondary[200] }}
          >{`Tore: ${goals}`}</Typography>
          <Typography
            sx={{ fontSize: "12px", color: theme.palette.secondary[200] }}
          >{`Tore pro Spiel: Ø ${
            Number.isInteger(goals / gamesPlayed)
              ? goals / gamesPlayed
              : (goals / gamesPlayed).toFixed(2)
          }`}</Typography>
          {mostGoals.slice(0, 1) !== "0" ? (
            <Typography
              sx={{ fontSize: "12px", color: theme.palette.secondary[200] }}
            >{`Meiste Tore: ${mostGoals}`}</Typography>
          ) : (
            <Box />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const Team = () => {
  const teamID = useSelector((state) => state.global.teamId);
  const theme = useTheme();
  const Navigate = useNavigate();
  const { data: teamData, isLoadingTeam } = useGetTeamModelQuery();

  const {
    data: games,
    error,
    isLoading,
  } = useGetGamesWithParticipationQuery(teamID);
  const allLineups = games
    ?.map((game) => {
      if (game.summary.homeTeam.id === teamID) {
        const homeLineup = game.lineup.home.map((obj) => ({
          ...obj,
          team: game.summary.homeTeam.name,
          acronym: game.summary.homeTeam.acronym,
          opponent: game.summary.awayTeam.name,
        }));
        return homeLineup;
      } else if (game.summary.awayTeam.id) {
        const awayLineup = game.lineup.away.map((obj) => ({
          ...obj,
          team: game.summary.awayTeam.name,
          acronym: game.summary.awayTeam.acronym,
          opponent: game.summary.homeTeam.name,
        }));
        return awayLineup;
      }
      return null;
    })
    .filter((lineup) => lineup.length !== 0)
    .flat();

  //LAST FIVE GAMES
  const lastFive = games
    ?.filter((game) => new Date(game.summary.startsAt).getTime() < Date.now())
    .sort((a, b) => new Date(b.summary.startsAt) - new Date(a.summary.startsAt))
    .slice(0, 5);
  //OVERALL LINEUP
  const overallLineup = GetOverallLineupData(games || [], teamID).sort(
    (a, b) => a.number - b.number
  );
  console.log(overallLineup);
  let mostGoals = 0;
  if (isLoading || isLoadingTeam) {
    return <div>Loading....</div>;
  }
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="KADER"
        subtitle={teamData.find((team) => team.id === teamID).name}
      />
      {overallLineup || !isLoading ? (
        <Box
          mt="20px"
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          flexWrap="wrap"
          gap="20px"
        >
          {overallLineup.map(
            ({
              firstname,
              lastname,
              number,
              position,
              gamesPlayed,
              goals,
              id,
            }) => (
              (mostGoals = allLineups
                .filter((player) => player.number === number)
                .reduce((acc, currentPlayer) => {
                  if (
                    !acc[currentPlayer.id] ||
                    currentPlayer.goals > acc[currentPlayer.id].goals
                  ) {
                    acc[currentPlayer.id] = currentPlayer;
                  }

                  return acc;
                }, {})),
              (
                <Player
                  firstname={firstname}
                  lastname={lastname}
                  number={number}
                  position={position}
                  gamesPlayed={gamesPlayed}
                  goals={goals}
                  mostGoals={`${mostGoals[id].goals} gegen ${mostGoals[id].opponent}`}
                />
              )
            )
          )}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};
export default Team;
