import { useTheme } from "@emotion/react";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useGetGamesWithParticipationQuery,
  useGetTeamModelQuery,
} from "state/api";
import { GetOverallLineupData } from "./dataFormat";
import Header from "components/Header";
import { Box, Typography, Stack } from "@mui/material";

import { Player } from "./Player";
import { CustomSwitch } from "components/CustomSwitch";

const Team = () => {
  const teamID = useSelector((state) => state.global.teamId);
  const theme = useTheme();
  const [isSwitchChecked, setIsSwitchChecked] = useState(true);
  const handleSwitchChange = (event) => {
    setIsSwitchChecked(event.target.checked);
  };
  const { data: teamData, isLoadingTeam } = useGetTeamModelQuery();

  const {
    data: games,
    error,
    isLoading,
  } = useGetGamesWithParticipationQuery(teamID);

  //OVERALL LINEUP
  const overallLineup = useMemo(() => {
    return GetOverallLineupData(games || [], teamID).sort(
      (a, b) => a.number - b.number
    );
  }, [games, teamID]);
  const [visiblePlayers, setVisiblePlayers] = useState(overallLineup);
  useEffect(() => {
    const sortedLineup = isSwitchChecked
      ? [...overallLineup].sort((a, b) => a.number - b.number)
      : [...overallLineup].sort((a, b) => b.goals - a.goals);
    setVisiblePlayers(sortedLineup);
  }, [isSwitchChecked, overallLineup]);

  if (isLoading || isLoadingTeam) {
    return <div>Loading....</div>;
  }
  if (error) {
    return <div>error</div>;
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
          <CustomSwitch
            checked={isSwitchChecked}
            onChange={handleSwitchChange}
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
