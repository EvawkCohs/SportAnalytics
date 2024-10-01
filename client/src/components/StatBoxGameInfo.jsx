import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import SportsScoreOutlinedIcon from "@mui/icons-material/SportsScoreOutlined";
import SportsOutlinedIcon from "@mui/icons-material/SportsOutlined";
import { useGetTeamModelQuery } from "state/api";

const StatBoxGameInfo = ({
  title,
  finalScore,
  homeTeam,
  awayTeam,
  halftimeScore,
  round,
  state,
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
  }, [teamData]);

  return (
    <Box>
      {state !== undefined ? (
        <Box
          display="grid"
          gridTemplateColumns="repeat(6, 1fr)"
          alignItems="center"
        >
          <Box gridColumn="1">
            {state === "pre" ? (
              <SportsOutlinedIcon
                fontSize="large"
                sx={{ color: theme.palette.secondary[200] }}
              />
            ) : (
              <SportsScoreOutlinedIcon
                fontSize="large"
                sx={{ color: theme.palette.secondary[200] }}
              />
            )}
          </Box>
          <Typography
            variant="h2"
            sx={{ color: theme.palette.secondary[200] }}
            textAlign="center"
            gridColumn="3/5"
          >
            {title}
          </Typography>
        </Box>
      ) : (
        <Typography
          variant="h2"
          sx={{ color: theme.palette.secondary[200] }}
          textAlign="center"
          gridColumn="3/5"
        >
          {title}
        </Typography>
      )}
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
