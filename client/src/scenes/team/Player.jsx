import React, { useEffect, useState } from "react";
import {
  useTheme,
  Grow,
  Card,
  CardContent,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
export const Player = ({
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
          border: `1px solid #2f2b38`,
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
