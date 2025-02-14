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
          display="flex"
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box>
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
            flexGrow={1}
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
          flexGrow={1}
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
        flexGrow={1}
      >
        {round}
      </Typography>

      <Box
        display="flex"
        justifyContent={"space-evenly"}
        alignItems="center"
        width={"100%"}
        sx={{
          p: {
            xs: "0.25rem 0.125rem", // für sehr kleine Bildschirme
            sm: "0.5rem 0.25rem", // für kleine Bildschirme
            md: "0 0", // für mittlere Bildschirme
            lg: "0 0", // für größere Bildschirme
            xl: "0.5rem 0",
          },
        }}
      >
        {/*ROW 1 */}

        <Typography
          variant="h4"
          sx={{
            color: theme.palette.secondary[100],
            flex: 1,
          }}
          textAlign={"center"}
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
          flex={1}
        >
          {finalScore}
        </Typography>

        <Typography
          variant="h4"
          textAlign="center"
          flex={1}
          sx={{
            color: theme.palette.secondary[100],
          }}
        >
          {awayTeam}
        </Typography>
      </Box>
      <Box
        display="flex"
        justifyContent={"space-evenly"}
        alignItems="center"
        width={"100%"}
        sx={{
          p: {
            xs: "0.25rem 0.125rem", // für sehr kleine Bildschirme
            sm: "0 0", // für kleine Bildschirme
            md: "0 0", // für mittlere Bildschirme
            lg: "0 0", // für größere Bildschirme
            xl: "0 0",
          },
        }}
      >
        {/*ROW 2 */}

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flex={1}
          sx={{
            height: {
              xs: "20px",
              sm: "20px",
              md: "35px",
              lg: "50px",
              xl: "50px",
            },
            mr: {
              xs: "4rem",
              sm: "2rem",
              md: "3rem",
              lg: "4rem",
              xl: "10rem",
            },
          }}
        >
          <img src={homeTeamLogo} height="100%" alt="hometeam" />
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

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flex={1}
          sx={{
            height: {
              xs: "20px",
              sm: "20px",
              md: "35px",
              lg: "50px",
              xl: "50px",
            },
            ml: {
              xs: "4rem",
              sm: "2rem",
              md: "3rem",
              lg: "4rem",
              xl: "10rem",
            },
          }}
        >
          <img src={awayTeamLogo} height="100%" alt="awayteam" />
        </Box>
      </Box>
    </Box>
  );
};

export default StatBoxGameInfo;
