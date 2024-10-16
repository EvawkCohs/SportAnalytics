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
                sx={{
                  color: theme.palette.secondary[200],
                  fontSize: {
                    xs: "16px",
                    sm: "16px",
                    md: "24px",
                    lg: "32px",
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
                    md: "24px",
                    lg: "32px",
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
              fontSize: {
                xs: "1rem", // für sehr kleine Bildschirme
                sm: "1rem", // für kleine Bildschirme
                md: "1.5rem", // für mittlere Bildschirme
                lg: "1.5rem", // für größere Bildschirme
                xl: "2rem",
              },
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
            fontSize: {
              xs: "1rem", // für sehr kleine Bildschirme
              sm: "1rem", // für kleine Bildschirme
              md: "1.5rem", // für mittlere Bildschirme
              lg: "1.5rem", // für größere Bildschirme
              xl: "2rem",
            },
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
          fontSize: {
            xs: "0.75rem", // für sehr kleine Bildschirme
            sm: "0.75rem", // für kleine Bildschirme
            md: "1rem", // für mittlere Bildschirme
            lg: "1rem", // für größere Bildschirme
            xl: "1.25rem",
          },
        }}
        textAlign="center"
      >
        {round}
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        //Padding einfügen
        alignItems="center"
        sx={{
          p: {
            xs: "0.25rem 0.125rem", // für sehr kleine Bildschirme
            sm: "0.5rem 0.25rem", // für kleine Bildschirme
            md: "0.75rem 0.5rem", // für mittlere Bildschirme
            lg: "1rem 0.75rem", // für größere Bildschirme
            xl: "1.25rem 1rem",
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
            fontSize: {
              xs: "0.75rem", // für sehr kleine Bildschirme
              sm: "0.75rem", // für kleine Bildschirme
              md: "1rem", // für mittlere Bildschirme
              lg: "1rem", // für größere Bildschirme
              xl: "1.25rem",
            },
          }}
          gridColumn="span 1"
        >
          {homeTeam}
        </Typography>

        <Typography
          variant="h2"
          fontWeight="600"
          sx={{
            color: theme.palette.secondary[200],
            fontSize: {
              xs: "1rem", // für sehr kleine Bildschirme
              sm: "1rem", // für kleine Bildschirme
              md: "1.5rem", // für mittlere Bildschirme
              lg: "1.5rem", // für größere Bildschirme
              xl: "2rem",
            },
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
            fontSize: {
              xs: "0.75rem", // für sehr kleine Bildschirme
              sm: "0.75rem", // für kleine Bildschirme
              md: "1rem", // für mittlere Bildschirme
              lg: "1rem", // für größere Bildschirme
              xl: "1.25rem",
            },
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
              md: "30px",
              lg: "40px",
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
            fontSize: {
              xs: "0.75rem", // für sehr kleine Bildschirme
              sm: "0.75rem", // für kleine Bildschirme
              md: "1rem", // für mittlere Bildschirme
              lg: "1rem", // für größere Bildschirme
              xl: "1.25rem",
            },
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
              md: "30px",
              lg: "40px",
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
