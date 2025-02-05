import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const StatBoxMVP = ({
  nameMVP,
  goalsMVP,
  penaltyMVP,
  teamMVP,
  name2nd,
  goals2nd,
  penalty2nd,
  team2nd,
  name3rd,
  goals3rd,
  penalty3rd,
  team3rd,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        gridColumn: {
          xs: "1",
          sm: "1",
          md: "1/3",
          lg: "1/3",
          xl: "1/3",
        },
        p: {
          xs: "0.25rem 0.25rem",
          sm: "0.5rem 0.25rem",
          md: "0.75rem 0.5rem",
          lg: "1rem 0.75rem",
          xl: "1.25rem 1rem",
        },
        gridRow: {
          xs: "2",
          sm: "2",
          md: "2",
          lg: "1",
          xl: "1",
        },
      }}
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
      className="data-display"
      border="1px solid #2f2b38"
    >
      <Typography
        variant="h2"
        sx={{ color: theme.palette.secondary[200] }}
        textAlign="center"
      >
        Wertvollste Spieler
      </Typography>
      <Typography
        variant="h5"
        sx={{ color: theme.palette.secondary[100] }}
        textAlign="center"
      >
        {nameMVP} {goalsMVP} Tore davon {penaltyMVP} Siebenmeter ({teamMVP})
      </Typography>
      <Typography
        variant="h6"
        sx={{ color: theme.palette.secondary[100] }}
        textAlign="center"
      >
        {name2nd} {goals2nd} Tore davon {penalty2nd} Siebenmeter ({team2nd})
      </Typography>
      <Typography
        variant="h6"
        sx={{ color: theme.palette.secondary[100] }}
        textAlign="center"
      >
        {name3rd} {goals3rd} Tore davon {penalty3rd} Siebenmeter ({team3rd})
      </Typography>
    </Box>
  );
};

export default StatBoxMVP;
