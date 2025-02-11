import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
  homeGoals,
  awayGoals,
}) => {
  const theme = useTheme();
  const { data: teamData, isLoading } = useGetTeamModelQuery();
  const [homeTeamLogo, setHomeTeamLogo] = useState("");
  const [awayTeamLogo, setAwayTeamLogo] = useState("");
  const [isWin, setIsWin] = useState(false);
  const [isLose, setIsLose] = useState(false);
  const teamName = useSelector((state) => state.global.teamName);
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
    if (teamName === homeTeam) {
      setIsWin(homeGoals > awayGoals);
      setIsLose(homeGoals < awayGoals);
    } else if (teamName === awayTeam) {
      setIsWin(awayGoals > homeGoals);
      setIsLose(awayGoals < homeGoals);
    } else {
      setIsWin(false);
      setIsLose(false);
    }
  }, [teamData, homeGoals, awayGoals, homeTeam, awayTeam, teamName, isLoading]);

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
                sx={{
                  color: theme.palette.secondary[200],
                  fontSize: {
                    xs: "16px",
                    sm: "16px",
                    md: "48px",
                    lg: "48px",
                    xl: "48px",
                  },
                }}
              />
            ) : (
              <SportsScoreOutlinedIcon
                sx={{
                  color: theme.palette.secondary[200],
                  fontSize: {
                    xs: "16px",
                    sm: "16px",
                    md: "48px",
                    lg: "48px",
                    xl: "48px",
                  },
                }}
              />
            )}
          </Box>
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.secondary[200],
             
            }}
            textAlign="center"
            gridColumn="3/5"
          >
            {title}
          </Typography>
        </Box>
      ) : (
        <Typography
          variant="h2"
          sx={{
            color: theme.palette.secondary[200],
           
          }}
          textAlign="center"
          gridColumn="3/5"
        >
          {title}
        </Typography>
      )}
      <Typography
        variant="h4"
        sx={{
          color: theme.palette.secondary[100],
          
        }}
        textAlign="center"
      >
        {round}
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        
        alignItems="center"
        sx={{
          p: {
            xs: "0.25rem 0.125rem", // für sehr kleine Bildschirme
            sm: "0.5rem 0.25rem", // für kleine Bildschirme
            md: "0 0", // für mittlere Bildschirme
            lg: "0 0", // für größere Bildschirme
            xl: "0 0",
          },
        }}
      >
        {/*ROW 1 */}

        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="300"
          sx={{
            color: theme.palette.secondary[100],
            
          }}
          gridColumn="span 1"
        >
          {homeTeam}
        </Typography>

        <Typography
          variant="h2"
          fontWeight="600"
          sx={{
            color: isWin
              ? theme.palette.green[100]
              : isLose
              ? theme.palette.red[500]
              : theme.palette.secondary[100],
          
          }}
          textAlign="center"
          gridColumn="2"
        >
          {finalScore}
        </Typography>

        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="300"
          sx={{
            color: theme.palette.secondary[100],
            
          }}
          gridColumn="3"
        >
          {awayTeam}
        </Typography>

        {/*ROW 2 */}

        {/*Später Vereinslog */}

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            height: {
              xs: "20px",
              sm: "20px",
              md: "50px",
              lg: "50px",
              xl: "50px",
            },
          }}
        >
          <img src={homeTeamLogo} height="100%" />
        </Box>
        <Typography
          variant="h4"
          fontWeight="400"
          sx={{
            color: theme.palette.secondary[200],
            
          }}
          textAlign="center"
        >
          {halftimeScore}
        </Typography>
        {/*Später Vereinslog */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center "
          sx={{
            height: {
              xs: "20px",
              sm: "20px",
              md: "50px",
              lg: "50px",
              xl: "50px",
            },
          }}
        >
          <img src={awayTeamLogo} height="100%" />
        </Box>
      </Box>
    </Box>
  );
};

export default StatBoxGameInfo;
