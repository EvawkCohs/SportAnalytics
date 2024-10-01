import { useTheme } from "@emotion/react";
import React, { useState, useEffect } from "react";
import { alpha } from "@mui/material/styles";
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
  CardContent,
  Typography,
  Switch,
  Stack,
  Grow,
} from "@mui/material";

const Player = ({
  player,
  id,
  firstname,
  lastname,
  position,
  number,
  gamesPlayed,
  goals,

  games,
}) => {
  const theme = useTheme();
  const Navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const handleClick = () => {
    Navigate(`/dashboard/playerDetails/${id}`, {
      state: { player: player, allGamesDetails: games },
    });
  };
  useEffect(() => {
    setChecked(true);
  }, []);
  console.log(process.env.REACT_APP_BASE_URL);

  return (
    <Grow in={checked} timeout={1000}>
      <Card
        onClick={handleClick}
        sx={{
          backgroundImage: "none",
          backgroundColor: theme.palette.background.alt,
          borderRadius: "0.55rem",
          width: "350px",
          height: "250px",
          transition: `transform 0.4s ease-out, border-color 0.4s ease-out, box-shadow 0.4s ease-out`,
          border: `2px solid transparent`,
          ":hover": {
            cursor: "pointer",
            backgroundColor: theme.palette.background.alt,
            transform: `scale(1.1)`,
            border: `2px solid ${theme.palette.secondary[400]}`,
            boxShadow: `0 0 8px ${theme.palette.secondary[500]}`,
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
          <Box
            display="flex"
            justifyContent="flex-start"
            flexDirection="column"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              flexDirection="row"
              gap="50px"
              alignItems="center"
              mb="12px"
              sx={{
                borderBottom: `2px solid ${theme.palette.grey[500]}`,
              }}
            >
              <Box
                display="flex"
                justifyContent="flex-start"
                flexDirection="column"
                alignItems="baseline"
              >
                <Typography
                  sx={{
                    fontSize: "32px",
                    color: theme.palette.secondary[200],
                  }}
                >
                  {lastname}
                </Typography>
                <Typography
                  sx={{ fontSize: "20px", color: theme.palette.secondary[200] }}
                >
                  {firstname}
                </Typography>
              </Box>
              <Typography
                sx={{ fontSize: "50px", color: theme.palette.secondary[200] }}
              >{`# ${number}`}</Typography>
            </Box>
            <Typography
              sx={{ fontSize: "14px", color: theme.palette.secondary[100] }}
            >{`Position: ${position}`}</Typography>
            <Typography
              sx={{ fontSize: "14px", color: theme.palette.secondary[100] }}
            >{`Spiele: ${gamesPlayed}`}</Typography>
            <Typography
              sx={{ fontSize: "14px", color: theme.palette.secondary[100] }}
            >{`Tore: ${goals}`}</Typography>
            <Typography
              sx={{ fontSize: "14px", color: theme.palette.secondary[100] }}
            >{`Tore pro Spiel: Ø ${
              Number.isInteger(goals / gamesPlayed)
                ? goals / gamesPlayed
                : (goals / gamesPlayed).toFixed(2)
            }`}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

const Team = () => {
  const teamID = useSelector((state) => state.global.teamId);
  const theme = useTheme();
  const [isSwitchChecked, setIsSwitchChecked] = useState(false);
  const handleSwitchChange = (event) => {
    setIsSwitchChecked(event.target.checked);
    setVisiblePlayers(overallLineup);
  };
  const { data: teamData, isLoadingTeam } = useGetTeamModelQuery();

  const {
    data: games,
    error,
    isLoading,
  } = useGetGamesWithParticipationQuery(teamID);

  //OVERALL LINEUP
  const overallLineup = GetOverallLineupData(games || [], teamID).sort(
    (a, b) => {
      return isSwitchChecked ? a.number - b.number : b.goals - a.goals;
    }
  );
  const [visiblePlayers, setVisiblePlayers] = useState(overallLineup);

  if (isLoading || isLoadingTeam) {
    return <div>Loading....</div>;
  }
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="KADER"
        subtitle={teamData.find((team) => team.id === teamID).name}
      />

      <Box display="flex" alignItems="center" flexDirection="column">
        <Typography sx={{ variant: "h5", color: theme.palette.secondary[200] }}>
          Sortieren des Kaders:{" "}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography
            sx={{ variant: "h5", color: theme.palette.secondary[200] }}
          >
            Nach Toren
          </Typography>
          <Switch
            defaultChecked={false}
            checked={isSwitchChecked}
            onChange={handleSwitchChange}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: theme.palette.secondary[500],

                "&:hover": {
                  backgroundColor: alpha(theme.palette.secondary[500], 0.1),
                },
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: theme.palette.secondary[500],
              },
              "&.Mui-disabled .MuiSwitch-thumb": {
                color: theme.palette.secondary[700],
              },
            }}
          />
          <Typography
            sx={{ variant: "h5", color: theme.palette.secondary[200] }}
          >
            Nach Nummern
          </Typography>
        </Stack>
      </Box>
      {overallLineup || !isLoading ? (
        <Box
          mt="20px"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          flexWrap="wrap"
          gap="20px"
        >
          {visiblePlayers.map(
            (
              { firstname, lastname, number, position, gamesPlayed, goals, id },
              index
            ) => (
              <Player
                player={overallLineup.flat().find((player) => player.id === id)}
                id={id}
                firstname={firstname}
                lastname={lastname}
                number={number}
                position={position}
                gamesPlayed={gamesPlayed}
                goals={goals}
                games={games}
                timeout={index}
              />
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
