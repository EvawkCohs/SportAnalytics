import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import { useGetTeamModelQuery } from "state/api";

const StatBoxGameInfo = ({
  title,
  finalScore,
  homeTeam,
  awayTeam,
  halftimeScore,
  round,
}) => {
  const theme = useTheme();
  const { data: teamData, isLoading } = useGetTeamModelQuery();
  const [homeTeamLogo, setHomeTeamLogo] = useState("");
  const [awayTeamLogo, setAwayTeamLogo] = useState("");
  useEffect(() => {
    if (
      isLoading ||
      teamData === undefined ||
      teamData.length < 1 ||
      homeTeam === undefined ||
      awayTeam === undefined
    )
      return;
    setHomeTeamLogo(teamData.find((team) => team.name === homeTeam).logo);
    setAwayTeamLogo(teamData.find((team) => team.name === awayTeam).logo);
  });

  return (
    <Box>
      <Typography
        variant="h2"
        sx={{ color: theme.palette.secondary[200] }}
        textAlign="center"
      >
        {title}
      </Typography>
      <Typography
        variant="h4"
        sx={{ color: theme.palette.secondary[100] }}
        textAlign="center"
      >
        {round}
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        p="1.25rem 1rem"
        alignItems="center"
      >
        {/*ROW 1 */}

        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="300"
          sx={{ color: theme.palette.secondary[100] }}
          gridColumn="span 1"
        >
          {homeTeam}
        </Typography>

        <Typography
          variant="h2"
          fontWeight="600"
          sx={{ color: theme.palette.secondary[200] }}
          textAlign="center"
          gridColumn="2"
        >
          {finalScore}
        </Typography>

        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="300"
          sx={{ color: theme.palette.secondary[100] }}
          gridColumn="3"
        >
          {awayTeam}
        </Typography>

        {/*ROW 2 */}

        {/*Später Vereinslog */}

        <Box display="flex" justifyContent="center" alignItems="center">
          <img src={homeTeamLogo} height="50px" />
        </Box>
        <Typography
          variant="h4"
          fontWeight="400"
          sx={{ color: theme.palette.secondary[200] }}
          textAlign="center"
        >
          {halftimeScore}
        </Typography>
        {/*Später Vereinslog */}
        <Box display="flex" justifyContent="center" alignItems="center">
          <img src={awayTeamLogo} height="50px" />
        </Box>
      </Box>
    </Box>
  );
};

export default StatBoxGameInfo;
